import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function openApp(page: Page) {
  await page.goto('/')
  await page.waitForFunction(() => window.__diagramer !== undefined)
}

test('empty selection shows the neutral state', async ({ page }) => {
  await openApp(page)
  await expect(page.getByTestId('inspector')).toContainText('Select an element')
})

test('editing a node in the inspector updates canvas and document', async ({ page }) => {
  await openApp(page)
  await page.evaluate(() => window.__diagramer!.addNode('c4.system', { x: 0, y: 0 }))
  await page.locator('.react-flow__node').click()
  const label = page.getByTestId('inspector-label')
  await expect(label).toHaveValue('Software System')
  await label.fill('Billing Service')
  await page.getByTestId('inspector-description').fill('Handles invoices')
  await expect(page.locator('.c4-node__label')).toHaveText('Billing Service')
  await expect(page.locator('.c4-node__description')).toHaveText('Handles invoices')
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.nodes[0].data.label).toBe('Billing Service')
  expect(doc.nodes[0].data.description).toBe('Handles invoices')
})

test('editing an edge sets label and technology chip', async ({ page }) => {
  await openApp(page)
  await page.evaluate(() => {
    const a = window.__diagramer!.addNode('c4.person', { x: 0, y: 0 })
    const b = window.__diagramer!.addNode('c4.system', { x: 0, y: 400 })
    window.__diagramer!.loadDocument({
      ...window.__diagramer!.getDocument(),
      edges: [
        {
          id: 'edge-1',
          type: 'c4.relationship',
          source: a!,
          target: b!,
          data: { label: 'Uses' },
        },
      ],
    })
  })
  await page.locator('.c4-edge__label').click()
  await expect(page.getByTestId('inspector-label')).toHaveValue('Uses')
  await expect(page.getByTestId('inspector-description')).toHaveCount(0)
  await page.getByTestId('inspector-technology').fill('JSON/HTTPS')
  await expect(page.locator('.c4-edge__tech')).toHaveText('[JSON/HTTPS]')
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.edges[0].data?.technology).toBe('JSON/HTTPS')
})

test('typing Backspace in inspector fields does not delete the element', async ({ page }) => {
  await openApp(page)
  await page.evaluate(() => window.__diagramer!.addNode('c4.person', { x: 0, y: 0 }))
  await page.locator('.react-flow__node').click()
  const label = page.getByTestId('inspector-label')
  await label.click()
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await expect(page.locator('.react-flow__node')).toHaveCount(1)
  await expect(label).toHaveValue('Pers')
})

test('diagram name is editable and feeds the document meta', async ({ page }) => {
  await openApp(page)
  const name = page.getByTestId('doc-name')
  await name.fill('Payments Landscape')
  const doc = await page.evaluate(() => window.__diagramer!.getDocument())
  expect(doc.meta.name).toBe('Payments Landscape')
  await page.reload()
  await expect(page.getByTestId('doc-name')).toHaveValue('Payments Landscape')
})

test('error toast auto-dismisses after a few seconds', async ({ page }) => {
  await openApp(page)
  await page.evaluate(() => window.__diagramer!.addNode('c4.bogus', { x: 0, y: 0 }))
  await expect(page.getByTestId('error-toast')).toBeVisible()
  await expect(page.getByTestId('error-toast')).toBeHidden({ timeout: 6000 })
})

test('occluded edge label is still editable (REQ-012)', async ({ page }) => {
  await openApp(page)
  // Target node sits down-right so the bezier midpoint falls inside it.
  await page.evaluate(() => {
    const a = window.__diagramer!.addNode('c4.person', { x: 0, y: 0 })
    const b = window.__diagramer!.addNode('c4.system', { x: 260, y: 160 })
    window.__diagramer!.loadDocument({
      ...window.__diagramer!.getDocument(),
      edges: [
        {
          id: 'edge-occluded',
          type: 'c4.relationship',
          source: a!,
          target: b!,
          sourceHandle: 'right',
          targetHandle: 'top',
          data: { label: 'Uses' },
        },
      ],
    })
  })
  await page.locator('.c4-edge__label').dblclick()
  await page.locator('.c4-edge__input').fill('Still editable')
  await page.locator('.c4-edge__input').press('Enter')
  await expect(page.locator('.c4-edge__label')).toContainText('Still editable')
})
