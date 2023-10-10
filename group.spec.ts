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
})
test('Verify the pages are navigated with proper pagination in tabular view @tabular',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.tabular.click();
    // await expect(page).toHaveURL(`${baseUrl}page/02d3c622-00d9-4c90-a1ac-82dbed96c655/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    for(let i=0; i<5; i++){
    await page.locator("div[class*='mat-select-arrow']").first().click();
    const count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
    await page.locator("span[class='mat-option-text']").nth(i).click();
    await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
    const no = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').all();
        const no1 = no.length; 
    const noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
    console.log(noOfcount+" no.of invoice " +no1);       
    for(let i=0; i<4;i++){
        await page.locator('button[class*="mat-paginator-navigation-next"]').click();
        await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
        const no = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').all();
        const no2 = no.length;    
        if(no1>no2){console.log(no2);break;}
        expect(count).toContain(`${no1}`);        
        const text = await page.locator('div[class="mat-paginator-range-label"]').textContent();  
        console.log(text + " No.of invoice " +no2); 
    }}
})
test("Verify the records are filtered based on the valid input in tabular view @tabular",async()=>{    
    await list.menu.click();
    await list.explorer.click();
    //await expect(page).toHaveURL(`${baseUrl}page/b6dfd566-f96b-4d19-a4b4-b1ea48779950/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    await list.listPages.click();
    await list.tabular.click();
    //await expect(page).toHaveURL(`${baseUrl}fgPage/02d3c622-00d9-4c90-a1ac-82dbed96c655/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    
    //Filters of Reference#, Customer Reference, Stage, Status, Invoice Date and Due Date
    const inputs=["INV20230518345473","rrr","INITIATION","NEW","2023-08-03",'2023-07-26'];
    const filters=["reference","customer ref","stage","status","Inv.date","due.date"];
    for(let i=0; i<6; i++){       
    await page.locator("button[class*='btn-toggle mat-icon-button']").nth(i).click();
    if(i==4 || i==5){await page.locator("//input[@type='date']").fill(inputs[i])}
    else{await page.locator("div[class*='mat-form-field-infix']").nth(1).click();
     await page.locator('input[class]').fill(inputs[i]); }   
    await page.locator('//span[text()="Search"]').click();
    await page.waitForTimeout(2000);
    const no = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').all();
    const no1 = no.length;
    console.log(filters[i],no1);
   await page.locator("button[class*='btn-toggle mat-icon-button']").nth(i).click();
    await page.locator('//span[text()="Clear"]').click();
    }
})
test("Verifying the search filters with invalid input in tabular view @tabular",async()=>{    
    await list.menu.click();
    await list.explorer.click();
    //await expect(page).toHaveURL(`${baseUrl}page/b6dfd566-f96b-4d19-a4b4-b1ea48779950/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    await list.listPages.click();
    await list.tabular.click();
    //await expect(page).toHaveURL(`${baseUrl}fgPage/02d3c622-00d9-4c90-a1ac-82dbed96c655/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    const inputs=["INV20230425291984","werju","VALIITATION","YOUNG","2001-09-03",'2000-07-07'];
    const filters=["reference","customer ref","stage","status","Inv.date","due.date"];
    for(let i=0; i<6; i++){       
    await page.locator("button[class*='btn-toggle mat-icon-button']").nth(i).click();
    if(i==4 || i==5){
    await page.locator("//input[@type='date']").fill(inputs[i])}
    else{await page.locator("div[class*='mat-form-field-infix']").nth(1).click();
     await page.locator('input[class]').fill(inputs[i]); }   
    await page.locator('//span[text()="Search"]').click();
    await page.waitForTimeout(2000);
    const no = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').all();
    const no1 = no.length;
    console.log(filters[i],no1);
   await page.locator("button[class*='btn-toggle mat-icon-button']").nth(i).click();
    await page.locator('//span[text()="Clear"]').click();
    }
})
test('Validating 100 option item per page with pagination',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.tabular.click();
    await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').nth(1).waitFor({state:"visible"});
    const no = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').all();
    const no1 = no.length;    
    const text = await page.locator('div[class="mat-paginator-range-label"]').textContent();
    console.log(text,no1);
    await page.locator("div[class*='mat-select-arrow']").first().click();
    const count = await page.locator("span[class='mat-option-text']").nth(4).textContent();
    const count1 =count?.substring(1,4)
    await page.locator("span[class='mat-option-text']").nth(4).click();    
    for(let i=0; i<5;i++){await page.locator('button[class*="mat-paginator-navigation-next"]').click();
    await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').nth(1).waitFor({state:"visible"});
    const no = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').all();
    const no2 = no.length;
    if(count1!=`${no2}`){console.log(no2);break;}
    expect(count).toContain(`${no2}`);
    const text = await page.locator('div[class="mat-paginator-range-label"]').textContent();
    console.log(text,no2);
}
})
test('Sorting of Amount in tabular view',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.tabular.click();
    await page.locator("div[class*='mat-select-arrow']").first().click();
    await page.locator("span[class='mat-option-text']").nth(4).click();
    const amount1 = await page.locator("(//td[@role='cell'])[5]").textContent();    
    await page.locator("//div[text()=' Invoice Amount']").click();
    const amount2 = await page.locator("(//td[@role='cell'])[5]").textContent();
    expect(amount1).not.toBe(amount2);
    console.log(amount1,amount2);
})

