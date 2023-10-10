import { test,expect,Page} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let page : Page;
let list : EleListPages;

let baseUrl = "http://192.168.1.49:8086/";


test.describe('pagination of list pages1',async()=>{
   
    test('home page',async()=>{
        await page.goto(baseUrl);
        await expect(page.locator('button').filter({ hasText: 'view_comfy' })).toBeVisible();
        await expect(page).toHaveURL('');        
    })
    test('menu',async()=>{
        await page.locator('button').filter({ hasText: 'view_comfy' }).click();
        await expect(page.getByText('Fingress Explorer')).toBeVisible();
    })
    test('fingress explorer',async()=>{
        await page.getByText('Fingress Explorer').click();
        await expect(page).toHaveURL('');
        await expect(page.getByRole('button', { name: ' List Pages ' })).toBeVisible();
    })
    test('List Pages',async()=>{
        await page.getByRole('button', { name: ' List Pages ' }).click();
        await expect(page.getByRole('menuitem', { name: 'Tabular' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'List View', exact: true })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Calendar View' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Master Detail' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Kanban' })).toBeVisible();        
    })
    test('Tabular',async()=>{
        await page.getByRole('menuitem', { name: 'Tabular' }).click();
        await expect(page).toHaveURL('');
    })
    test('List View',async()=>{
        await page.getByRole('button', { name: ' List Pages ' }).click();
        await page.getByRole('menuitem', { name: 'List View', exact: true }).click();
        await expect(page).toHaveURL('');
    })
    test('Calendar view',async()=>{
        await page.getByRole('button', { name: ' List Pages ' }).click();
        await page.getByRole('menuitem', { name: 'Calendar View' }).click();
        await expect(page).toHaveURL('');
    })
    test('Master details',async()=>{
        await page.getByRole('button', { name: ' List Pages ' }).click();
        await page.getByRole('menuitem', { name: 'Master Detail' }).click();
        await expect(page).toHaveURL('');
    })
    test('Kanban',async()=>{
        await page.getByRole('button', { name: ' List Pages ' }).click();
        await page.getByRole('menuitem', { name: 'Kanban' }).click();
        await expect(page).toHaveURL('');
    })
})


test.only('pagination of list pages',async({page})=>{
    list = new EleListPages(page);
    await page.goto(baseUrl);
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.tabular.click();
    await list.listPages.click();
    await list.listView.click();
    await list.listPages.click();
    await list.calendar.click();
    await list.listPages.click();
    await list.masterDetails.click();
    await list.listPages.click();
    await list.kanban.click();
})