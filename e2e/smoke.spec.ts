import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/sample-context-diagram.json', import.meta.url), 'utf8'),
)

async function openApp(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.waitForFunction(() => window.__diagramer !== undefined)
}

test('app shell and canvas render', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('app-header')).toContainText('Diagramer')
  await expect(page.getByTestId('doc-name')).toHaveValue('Untitled diagram')
  await expect(page.getByTestId('canvas').locator('.react-flow')).toBeVisible()
  await expect(page.locator('.react-flow__minimap')).toBeVisible()
  await expect(page.locator('.react-flow__controls')).toBeVisible()
})

test('test hooks can seed and read a diagram', async ({ page }) => {
  await openApp(page)
  await page.evaluate((file) => window.__diagramer!.loadDocument(file), fixture)
  await expect(page.getByTestId('doc-name')).toHaveValue('Sample Context Diagram')
  await expect(page.locator('.react-flow__node')).toHaveCount(2)
  await expect(page.locator('.react-flow__edge')).toHaveCount(1)
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.nodes).toHaveLength(2)
  expect(doc.edges).toHaveLength(1)
  expect(doc.notation).toBe('c4')
})

test('diagram survives a page reload via sessionStorage', async ({ page }) => {
  await openApp(page)
  await page.evaluate((file) => window.__diagramer!.loadDocument(file), fixture)
  await expect(page.locator('.react-flow__node')).toHaveCount(2)
  await page.reload()
  await expect(page.getByTestId('doc-name')).toHaveValue('Sample Context Diagram')
  await expect(page.locator('.react-flow__node')).toHaveCount(2)
})

test('invalid diagram files are rejected', async ({ page }) => {
  await openApp(page)
  const error = await page.evaluate(() => {
    try {
      window.__diagramer!.loadDocument({ schemaVersion: 99, nodes: [] })
      return null
    } catch (e) {
      return (e as Error).message
    }
  })
  expect(error).toMatch(/schema version/)
})
