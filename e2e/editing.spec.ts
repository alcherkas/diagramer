import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function openApp(page: Page) {
  await page.goto('/')
  await page.waitForFunction(() => window.__diagramer !== undefined)
}

test('context palette shows the right C4 elements', async ({ page }) => {
  await openApp(page)
  await expect(page.getByTestId('palette-c4.person')).toBeVisible()
  await expect(page.getByTestId('palette-c4.system')).toBeVisible()
  await expect(page.getByTestId('palette-c4.system-external')).toBeVisible()
  await expect(page.getByTestId('palette-c4.container')).toHaveCount(0)
  await expect(page.getByTestId('palette-c4.component')).toHaveCount(0)
  await expect(page.getByTestId('palette-c4.boundary')).toHaveCount(0)
})

test('click-to-add creates a styled person node', async ({ page }) => {
  await openApp(page)
  await page.getByTestId('palette-c4.person').click()
  const node = page.locator('.react-flow__node')
  await expect(node).toHaveCount(1)
  await expect(node).toContainText('Person')
  await expect(node.locator('.c4-node--person')).toBeVisible()
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.nodes).toHaveLength(1)
  expect(doc.nodes[0].type).toBe('c4.person')
})

test('external system renders gray with external caption', async ({ page }) => {
  await openApp(page)
  await page.getByTestId('palette-c4.system-external').click()
  const node = page.locator('.react-flow__node')
  await expect(node.locator('.c4-node--external')).toBeVisible()
  await expect(node).toContainText('External')
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.nodes[0].data.external).toBe(true)
})

test('drag from palette adds node at the drop position', async ({ page }) => {
  await openApp(page)
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer())
  await page
    .getByTestId('palette-c4.system')
    .dispatchEvent('dragstart', { dataTransfer })
  const pane = page.locator('.react-flow__pane')
  const box = (await pane.boundingBox())!
  const dropX = box.x + box.width * 0.7
  const dropY = box.y + box.height * 0.3
  await pane.dispatchEvent('dragover', { dataTransfer, clientX: dropX, clientY: dropY })
  await pane.dispatchEvent('drop', { dataTransfer, clientX: dropX, clientY: dropY })
  await expect(page.locator('.react-flow__node')).toHaveCount(1)
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.nodes[0].type).toBe('c4.system')
})

test('container diagrams offer Container and Boundary; boundary renders dashed', async ({ page }) => {
  await openApp(page)
  await page.evaluate(() =>
    window.__diagramer!.loadDocument({
      schemaVersion: 1,
      notation: 'c4',
      notationVersion: '0.1.0',
      diagramKind: 'container',
      meta: { id: 'e2e-container', name: 'Container view', createdAt: '2026-07-31T00:00:00.000Z' },
      nodes: [],
      edges: [],
    }),
  )
  await expect(page.getByTestId('palette-c4.container')).toBeVisible()
  await expect(page.getByTestId('palette-c4.boundary')).toBeVisible()
  await page.getByTestId('palette-c4.boundary').click()
  await expect(page.locator('.c4-boundary')).toBeVisible()
  await expect(page.locator('.c4-boundary')).toContainText('Boundary')
})

test('added nodes expose four connection handles', async ({ page }) => {
  await openApp(page)
  await page.getByTestId('palette-c4.person').click()
  await expect(page.locator('.react-flow__node .react-flow__handle')).toHaveCount(4)
})
