import {test,expect,chromium, Browser, BrowserContext, Page} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;

let baseUrl = "http://192.168.1.49:8086/";


test.beforeAll(async()=>{
     browser = await chromium.launch();
     context = await browser.newContext();
     page = await context.newPage();
     list = new EleListPages(page);
     await page.goto(baseUrl);
     await list.menu.click();
     await list.explorer.click();
     await list.listPages.click();
     await list.kanban.click();
})
test.describe('Kanban',()=>{

test('Validating the maximizing options in kanban',async()=>{       
    
        await page.locator("button[aria-label='minimize board']").nth(1).waitFor({state:"visible"});
    const no_of_fields =await page.locator("button[aria-label='minimize board']").all();
    const no = no_of_fields.length;     
    
    for(let i=0;i < no;i++){
        await no_of_fields[0].waitFor({state:'visible'});
        await no_of_fields[0].click();
    }
    const maximize = await page.locator('button[aria-label="maximize board"]').all();
    const no1= maximize.length;  
    for(let i=0;i<no1;i++){
        await maximize[0].waitFor({state:'visible'});
        await maximize[0].click();
    }
})
test('kanban - validating board options of Kanban',async()=>{           
    await expect(page.locator('svg[class="ngx-charts"]').nth(1)).toBeVisible();
    await expect(page.locator('span[class*="line-clamp1"]').nth(1)).toBeVisible();    
    await page.locator('text="insert_chart"').click();
    expect(page.locator('svg[class="ngx-charts"]').nth(1)).not.toBeVisible();
    await page.locator('text="settings"').click();
    await page.locator("label[class='mat-slide-toggle-label']").nth(0).click();
    await page.locator("label[class='mat-slide-toggle-label']").nth(1).click();
    await page.locator("label[class='mat-slide-toggle-label']").nth(2).click();
    await page.locator('text="Close"').click();
    await expect(page.locator('svg[class="ngx-charts"]').nth(1)).toBeVisible();
    await page.locator('text="view_column"').click();
    await expect(page.locator('svg[class="ngx-charts"]').nth(1)).not.toBeVisible();
    await expect(page.locator('span[class*="line-clamp1"]').nth(1)).not.toBeVisible(); 
})
test('kanban - Validating board items in settings',async()=>{        
    await page.locator('text="settings"').click();
    const options = await page.locator('mat-chip').all();  
    for(let i=0;i<options.length;i++){ 
        if(i!=0){await page.locator('text="settings"').click();}
        await options[i].waitFor({state:"visible"});    
        await options[i].click();
        await page.locator('text="Close"').click();
        await expect(page.locator(`//div[contains(text(),'${options[i].textContent}')]`)).toBeHidden();
    }
})
test('kanban - Validating options presents in Redirection page',async()=>{        
    await page.locator('text="arrow_forward"').nth(0).click();
    // await expect(page).toHaveURL(`${baseUrl}page/30c7ea83-61ec-4bd5-8d37-fa62b9222ef0/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    await page.locator('span[class*="mat-checkbox-inner-container"]').nth(0).click();
    await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(1)).toBeChecked();
    await page.locator('span[class*="mat-checkbox-inner-container"]').nth(1).click();
    await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(0)).not.toBeChecked();
    await page.locator('text="Discard"').click();
    // await expect(page).toHaveURL(`${baseUrl}fgPage/7c33373a-c651-4579-a1f6-8d0bc948261c/44b4eb67-f5b8-482b-934f-a03d7f8796be`)
})
test("validating item per page in Kanban",async()=>{        
    for(let i=0; i<4; i++){
        await page.locator("div[class*='mat-select-arrow']").first().click();
        const count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
        await page.locator("span[class='mat-option-text']").nth(i).click();
        await page.waitForTimeout(2000);
        const noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();
        console.log(noOfcount);       
        await page.locator('button[class*="fg-icon-btn"]').nth(4).waitFor({state:"visible"});
            const no = await page.locator('button[class*="fg-icon-btn"]').all();
            const no1 = no.length;    
            if(i==3){console.log(no1);break;}
            expect(count).toContain(`${no1}`);            
            console.log(" No.of invoice " +no1);
        }
})
})
test('Validating the minimizing options in kanban',async()=>{    
    
    await page.locator("button[aria-label='minimize board']").nth(1).waitFor({state:"visible"});
    const no_of_fields =await page.locator("button[aria-label='minimize board']").all();
    const no=no_of_fields.length;      
    for(let i=0;i<no;i++){
        await no_of_fields[0].waitFor({state:'visible'});        
        await no_of_fields[0].click();
        if(i==no-1){ await expect(page.locator("div[style*='50px;']").nth(i-1)).toBeVisible();}
        else{await expect(page.locator("div[style*='50px;']").nth(i)).toBeVisible();}
    }
    await expect(page.locator('text="Bug /4"')).toContainText('Bug /4');
})