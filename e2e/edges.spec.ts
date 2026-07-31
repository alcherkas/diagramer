import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function openApp(page: Page) {
  await page.goto('/')
  await page.waitForFunction(() => window.__diagramer !== undefined)
}

/** Seed two nodes side by side and return their DOM handles. */
async function seedPair(page: Page) {
  await page.evaluate(() => {
    window.__diagramer!.addNode('c4.person', { x: 0, y: 0 })
    window.__diagramer!.addNode('c4.system', { x: 400, y: 0 })
  })
  await expect(page.locator('.react-flow__node')).toHaveCount(2)
}

async function connectPair(page: Page) {
  const handle = page.locator(
    '.react-flow__node-c4\\.person .react-flow__handle[data-handlepos="right"]',
  )
  await handle.hover()
  const handleBox = (await handle.boundingBox())!
  const target = (await page
    .locator('.react-flow__node-c4\\.system')
    .boundingBox())!
  await page.mouse.move(handleBox.x + 4, handleBox.y + 4)
  await page.mouse.down()
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, {
    steps: 10,
  })
  await page.mouse.up()
  await expect(page.locator('.react-flow__edge')).toHaveCount(1)
}

test('handle drag creates a labeled dashed relationship', async ({ page }) => {
  await openApp(page)
  await seedPair(page)
  await connectPair(page)
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.edges).toHaveLength(1)
  expect(doc.edges[0].type).toBe('c4.relationship')
  expect(doc.edges[0].data?.label).toBe('Uses')
  await expect(page.locator('.c4-edge__label')).toContainText('Uses')
  await expect(page.locator('path.c4-edge')).toHaveCount(1)
})

test('connection drop on the node body snaps to a handle', async ({ page }) => {
  // connectPair drops on the node center, not on a handle dot — success
  // proves connectionRadius snapping (cycle-2 feedback ergonomics).
  await openApp(page)
  await seedPair(page)
  await connectPair(page)
})

test('double-click edits the relationship label', async ({ page }) => {
  await openApp(page)
  await seedPair(page)
  await connectPair(page)
  await page.locator('.c4-edge__label').dblclick()
  const input = page.locator('.c4-edge__input')
  await expect(input).toBeVisible()
  await input.fill('Reads from')
  await input.press('Enter')
  await expect(page.locator('.c4-edge__label')).toContainText('Reads from')
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.edges[0].data?.label).toBe('Reads from')
})

test('selected edge deletes with the keyboard', async ({ page }) => {
  await openApp(page)
  await seedPair(page)
  await connectPair(page)
  await page.locator('.c4-edge__label').click()
  await page.keyboard.press('Backspace')
  await expect(page.locator('.react-flow__edge')).toHaveCount(0)
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.edges).toHaveLength(0)
})

test('self-loop attempts are rejected with a reason', async ({ page }) => {
  await openApp(page)
  await page.evaluate(() => {
    window.__diagramer!.addNode('c4.system', { x: 0, y: 0 })
  })
  const node = page.locator('.react-flow__node')
  await node.hover()
  const right = (await node
    .locator('.react-flow__handle[data-handlepos="right"]')
    .boundingBox())!
  const left = (await node
    .locator('.react-flow__handle[data-handlepos="left"]')
    .boundingBox())!
  await page.mouse.move(right.x + 4, right.y + 4)
  await page.mouse.down()
  await page.mouse.move(left.x + 4, left.y + 4, { steps: 10 })
  await page.mouse.up()
  await expect(page.locator('.react-flow__edge')).toHaveCount(0)
  await expect(page.getByTestId('error-toast')).toContainText('cannot depend on itself')
})
