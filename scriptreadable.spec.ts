import { test,expect } from "playwright/test";

test.only('List view',async({page})=>{    
   await test.step("Launch the url",async()=>{
        await page.goto('http://192.168.1.49:8086');
    })
    await test.step("Click on the menu",async()=>{
        await page.locator('text="view_comfy"').click();
    })
    await test.step("Click on the fingress explorer",async()=>{
        await page.locator('text="Fingress Explorer"').click();
    })
    await test.step("click on the list pages",async()=>{
        await page.locator('text="   List Pages   "').click();
    })
    await test.step('click on the list view',async()=>{
        await page.locator("text='List View'").click();
    })
    await test.step('click on the last pagination button',async()=>{
        await page.locator("text='Last'").click();
    })
    await test.step('the last option in pagination should be hidden from the page',async()=>{
        await expect(page.locator('text="Last"')).toBeHidden();
    })
})
