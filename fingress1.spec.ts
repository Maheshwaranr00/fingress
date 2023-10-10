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

test("Ensuring the appropriate redirection of menu in Home",async()=>{    
    await page.locator("(//span[@class='mat-button-wrapper'])[7]").waitFor({state:"visible"});
    await page.locator("(//span[@class='mat-button-wrapper'])[7]").click();//solutions
    await expect(page,"solutions").toHaveURL(`${baseUrl}page/2c04ace5-8ab1-42ee-99dc-f651459c2b44/bc6abfa0-dc63-4dec-8ff0-02f84c5a2bc4`);
    await page.locator("(//span[@class='mat-button-wrapper'])[8]").click();//services
    await expect(page,"services").toHaveURL(`${baseUrl}fgPage/823b90c5-9fcc-4884-ae32-1c1d1c71270e/bc6abfa0-dc63-4dec-8ff0-02f84c5a2bc4`);
    await page.locator("(//span[@class='mat-button-wrapper'])[9]").click();//platform
    await expect(page,"platform").toHaveURL(`${baseUrl}page/7b99b2d8-6596-4740-8ac0-5816ddd0b76d/bc6abfa0-dc63-4dec-8ff0-02f84c5a2bc4`);
    
})
test('Verify the pages are navigated with proper pagination in tabular view',async()=>{    
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
test.only("Verify the records are filtered based on the valid input in tabular view",async()=>{    
    await list.menu.click();
    await list.explorer.click();
    //await expect(page).toHaveURL(`${baseUrl}page/b6dfd566-f96b-4d19-a4b4-b1ea48779950/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    await list.listPages.click();
    await list.tabular.click();
    await page.pause();
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
test("Verifying the search filters with invalid input in tabular view",async()=>{    
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
test('List expansion',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.listView.waitFor({state:"visible" });
    await list.listView.click();
    //await expect(page).toHaveURL(`${baseUrl}fgPage/7618c0a1-9446-4c04-a00e-6634352f6111/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    //const view = await page.locator('div[class*="list-toggle"]').all();
    for(let i=0; i< 10;i++){
        await page.locator('div[class*="list-toggle"]').nth(i).click();
        console.log("validating rows");
        await expect(page.locator('//strong[text()="Due Date"]').nth(i)).toBeVisible();
    }
})
test('Filtering the records in List view',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    //Filter for Reference number, Stage and Status
    await list.listView.waitFor({state:"visible" });
    await list.listView.click();
    await page.locator('button[class*="btn-toggle"]').nth(1).waitFor({state:"visible"});
    const filters = await page.locator('button[class*="btn-toggle"]').all();
    const no = filters.length;
    const inputs = ['INV20230828474932','INITIATION','NEW'];
    const filter = ['Reference','Stage','status'];
    for(let i=0;i<no;i++){
        await filters[i].click();
        await page.locator("input[class*='mat-form-field-autofill-control']").fill(inputs[i]);
        await page.locator('text="Search"').click();
        await page.locator("button[class*='fg-icon-btn']").nth(0).waitFor({state:"visible"});
        const count = await page.locator("button[class*='fg-icon-btn']").all();
        console.log(filter[i]," : ",count.length);
        await filters[i].click();
        await page.locator('text="Clear"').click();
    }
})
test("Navigating between pages and extracting the records per page",async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.listView.waitFor({state:"visible" });
    await list.listView.click();
    const pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent();
    console.log(pageCount); 
    await page.locator('//a[text()="Last"]').click();
    const no_of_page = await page.locator('(//a[@class="page-link"])[6]').textContent(); 
    await page.locator('//a[text()="First"]').click();
    let activePage=await page.locator('li[class*="active"]').textContent();       
    let count1 = await page.locator('div[class*="list-toggle"]').all();
    console.log(no_of_page,activePage);
    // await page.locator('(//a[@class="page-link"])[7]').click();
    while(activePage!=no_of_page){             
        await page.locator("li[class*='page-next-item']").click();            
        await page.locator('span[class*="fg-paginator-total-pages"]').waitFor({state: "visible"});
        await page.locator('div[class*="list-toggle"]').nth(1).waitFor({state: "visible"});
        activePage = await page.locator('li[class*="active"]').textContent();
        const pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent(); 
        count1 = await page.locator('div[class*="list-toggle"]').all();
        const numb = await page.locator('span[class*="fg-paginator-total-records"]').textContent();
        console.log(pageCount, " : ",count1.length," : ",numb); 
    }
})
test('first & last visibility in List view pagination',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.listView.waitFor({state:"visible" });
    await list.listView.click();
    await expect(page.locator('//a[text()="First"]')).toBeHidden();
    await expect(page.locator('li[title="Previous Page"]')).toBeHidden();
    await page.locator('//a[text()="Last"]').click();
    await expect(page.locator('//a[text()="Last"]')).toBeHidden();
    await expect(page.locator('li[title="Next Page"]')).toBeHidden();
    await page.locator('(//a[@class="page-link"])[4]').click();
    await expect(page.locator('//a[text()="First"]')).toBeVisible();    
    await expect(page.locator('//a[text()="Last"]')).toBeVisible();    
})
test('Validating Next Page, Previous Page and Number page visibility', async()=>{
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.listView.waitFor({state:"visible" });
    await list.listView.click();
    await expect(page.locator('li[title="Next Page"]')).toBeVisible();
    await expect(page.locator('li[title="Previous Page"]')).toBeHidden();
    for(let i=0;i<5;i++){
        await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
    }
    await page.locator('//a[text()="Last"]').click();
    await expect(page.locator('li[title="Previous Page"]')).toBeVisible();
    await expect(page.locator('li[title="Next Page"]')).toBeHidden();
    for(let i=0;i<4;i++){
        await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
    }
    await page.locator('li[title="Previous Page"]').click();
    await expect(page.locator('li[title="Previous Page"]')).toBeVisible();
    await expect(page.locator('li[title="Next Page"]')).toBeVisible();
    for(let i=0;i<4;i++){
        await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
    }
})
test('validating Action navigation url, text content and discard',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.listView.click();
    await list.action.click();
    // await expect(page).toHaveURL(`${baseUrl}fgPage/1c87e5c3-9e88-4e5b-87e8-2c7f63c28169/44b4eb67-f5b8-482b-934f-a03d7f8796be/detail/2cd79090-eec7-4806-9445-ce2a7df58d89?id=%7B%22BILL_NAME%22:%22Test01%22,%22BILL_TO_GST%22:%2200265356%22,%22INVOICE_TO_PIN_CODE%22:%22600100%22,%22REFERENCE_ID%22:%22INV20230906499765%22,%22SUB_TYPE_CODE%22:%22FG_INVOICES%22,%22CUSTOMER_REFERENCE%22:%2224041311167000042529377.30%22,%22DUE_AMOUNT%22:null,%22INV_EMAIL%22:null,%22INVOICE_DATE%22:%222023-09-07%22,%22AMOUNT%22:null,%22DATE_DELIVERED%22:null,%22RADIO_FIELD%22:null,%22TYPE_CODE%22:%22FG_DEMO%22,%22ID%22:%2238b49194-0e51-4c09-8cf6-803e40d0a814%22,%22PROCESS_ID%22:%2237915c62-4ca2-11ee-bbb4-346f24208dd3%22,%22CREATED_BY%22:882,%22LAST_UPDATED_BY%22:883,%22GST_AMOUNT%22:null,%22LINE_ITEM_DISCOUNT_AMT%22:null,%22BILL_FROM%22:null,%22IS_TEMPLATE%22:false,%22LAST_UPDATED_ON%22:%222023-09-06T11:12:58.432Z%22,%22LAST_AUTHORISED_ON%22:%222023-09-06T11:12:58.416Z%22,%22LINE_ITEM_AMT_BASE%22:null,%22NAME%22:%22Assam%22,%22LINE_ITEM_AMT%22:null,%22TOTAL_TAX%22:null,%22ANCHOR_CODE%22:null,%22BILL_TYPE%22:null,%22PRODUCT_STATUS%22:%22Below%202000%22,%22ISSUING_PARTY_CODE%22:%22FINGRESS%22,%22ADDRESS%22:%22ASSAM%22,%22CREATED_ON%22:%222023-09-06T10:41:47.024Z%22,%22EMAIL_ID%22:null,%22LINE_NO%22:null,%22INV_NUMBER%22:%22TEST0005%22,%22TASK_ID%22:%2237915c81-4ca2-11ee-bbb4-346f24208dd3%22,%22APPLICANT_PARTY_CODE%22:%22AMAZON%22,%22INV_NAME%22:%22360%20Networks%22,%22IDENTIFIER_KEY%22:%22%7B%5C%22VERSION_ID%5C%22:1,%5C%22REFERENCE_ID%5C%22:%5C%22INV20230906499765%5C%22,%5C%22ID%5C%22:%5C%2238b49194-0e51-4c09-8cf6-803e40d0a814%5C%22%7D%22,%22STAGE_CODE%22:%22INITIATION%22,%22CURRENCY_CODE%22:null,%22BENE_ACC_NUMBER%22:null,%22DESCRIPTION%22:null,%22DEBIT_ACC_NUMBER%22:null,%22LAST_AUTHORISED_BY%22:883,%22ICON%22:null,%22BILL_ADDR3%22:null,%22IS_MASTER_VERSION%22:false,%22BILL_PHONE%22:null,%22CITY_1%22:%22Chennai%22,%22BILL_ADDR1%22:null,%22TOTAL_TAX_BASE%22:null,%22BILL_ADDR2%22:null,%22INV_STATUS%22:null,%22ACTIVE_CODE%22:%22ACTV%22,%22COUNTERPARTY_CODE%22:null,%22INV_ADDRESS1%22:%22A1%22,%22DUE_DATE%22:%222023-09-08T00:00:00.000Z%22,%22INV_ADDRESS3%22:null,%22APPLICANT_PARTY%22:%22AMAZON%22,%22INV_ADDRESS2%22:null,%22CREATED_NAME%22:%22Rajamanickam%20Ramachandran%22,%22BENE_NAME%22:%22AMAZON%22,%22STATUS_CODE%22:%22REJECTED%22,%22BILL_TO_PIN_CODE%22:%22629401%22,%22UPLOAD_REF_ID%22:null,%22VERSION_ID%22:1,%22BILL_TO%22:null,%22BILLING_PERIOD%22:null,%22CITY%22:%22Delhi%22,%22BILL_EMAIL%22:null,%22DISCOUNT_AMOUNT%22:null,%22INV_PHONE%22:null,%22DMS_ID%22:null%7D&viewMode=view`);
    for(let i=0;i<27;i++){
        await expect(page.locator('div[class="form-group"]').nth(i)).toBeVisible();
        const text = await page.locator('div[class="form-group"]').nth(i).textContent();
        console.log(text);
    }   
    await page.locator('text="Discard"').nth(0).click();
    // await expect(page).toHaveURL(`${baseUrl}fgPage/1c87e5c3-9e88-4e5b-87e8-2c7f63c28169/44b4eb67-f5b8-482b-934f-a03d7f8796be/detail/be760656-b999-4a42-bd20-5276c0f9f9e6`);
})
test('validating check boxes, search box & date in Action',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.listView.click();
    await list.action.click();
    await page.locator('span[class*="mat-checkbox-inner-container"]').nth(0).click();
    await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(1)).toBeChecked();
    await page.locator('span[class*="mat-checkbox-inner-container"]').nth(1).click();
    await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(0)).not.toBeChecked();
    await page.locator('input[class*="mat-input-element"]').nth(0).fill('djksbajdsbn');
    await expect(page.locator('text="Search"')).toBeVisible();
    await page.locator('text="Search"').click();
    await expect(page.locator('text="No Matching Data Found."')).toBeVisible();
    await page.locator('text="Clear"').click();
    await expect(page.locator('text="No Matching Data Found."')).not.toBeVisible();
    await expect(page.locator('text="Search"')).not.toBeVisible();
    await page.locator('text="calendar_today"').click();   
    await page.locator('text=" JUL "').click();
    const yearMonth = await page.locator("button[aria-label*='Choose month']").textContent();
    const day = await page.locator('text=" 7 "').textContent();
    await page.locator('text=" 7 "').click();
    await page.waitForTimeout(2000);
    const date = await page.locator('p span[class="ng-star-inserted"]').nth(7).textContent();
    console.log('entered date :' +day+":"+yearMonth+ " displayed date :"+date);    
})
test('Validating radio buttons of actions ',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.listView.click();
    await list.action.click();
    for(let i=0;i<3;i++){
    await page.locator('span[class="mat-radio-container"]').nth(i).click();
    if(i==0){
        await expect(page.locator('.mat-radio-container').nth(i+1)).not.toBeChecked();
        await expect(page.locator('.mat-radio-container').nth(i+2)).not.toBeChecked();
    }
    else if(i==1){
        await expect(page.locator('.mat-radio-container').nth(i-1)).not.toBeChecked();
        await expect(page.locator('.mat-radio-container').nth(i+1)).not.toBeChecked();
    }
    else {
        await expect(page.locator('.mat-radio-container').nth(i-2)).not.toBeChecked();
        await expect(page.locator('.mat-radio-container').nth(i-1)).not.toBeChecked();
    }    
    }
})
test('validating test page and its options visibility of action',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.listView.click();
    await list.action.click();
    await page.locator('text="Test"').click();
    // await expect(page).toHaveURL(`${baseUrl}fgRequestList/e87cdbcd-a7d2-4ce6-bcea-f223d80145b3/44b4eb67-f5b8-482b-934f-a03d7f8796be`)
    await expect(page.locator('text="Default List "')).toBeVisible();
    await page.locator('text="cloud_download"').click();
    await expect(page.locator('text="picture_as_pdf"')).toBeVisible();
    await expect(page.locator('text="border_all"')).toBeVisible();
    await page.locator('text="picture_as_pdf"').click();
})
test("validating item per page in redirection of action ",async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.listView.click();
    await list.action.click();
    await page.locator('text="Redirect"').click();
    // await expect(page).toHaveURL(`${baseUrl}fgRequestList/0b62dca4-d629-4ab3-ad4e-27c9217f64d1/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    for(let i=0; i<4; i++){
        await page.locator("div[class*='mat-select-arrow']").first().click();
        const count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
        await page.locator("span[class='mat-option-text']").nth(i).click();
        await page.waitForTimeout(2000);
        const noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();
        console.log(noOfcount);       
        await page.locator('button[class*="fg-icon-btn"]').nth(4).waitFor({state:"visible"});
            const no = await page.locator('button[class*="fg-icon-btn"]').all();
            const no1 = no.length/2;    
            if(i==3){console.log(no1);break;}
            expect(count).toContain(`${no1}`);            
            console.log(" No.of invoice " +no1);
        }
})
test('Calendar View - Verifying records marked against days in a month', async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.calendar.click();
    for(let i=1;i<31;i++){
        if(i<10){await page.locator(`//td[@data-date='2023-10-0${i}']`).click();}
        else{await page.locator(`//td[@data-date='2023-10-${i}']`).click();}
        const data = await page.locator("//h5").textContent();   
        try{expect(data,`date ${i}`).toContain('There are currently no records available.');}
        catch(Error){console.log(i)}
    }
})
test('Redirecting to today in month/day/week',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.calendar.click();
    for(let i=0;i<3;i++){
        const type = await page.locator('button[class*="fc-dayGrid"]').nth(i).textContent();
        await page.locator('button[class*="fc-dayGrid"]').nth(i).click();    
        const cal1 = await page.locator("//h2").textContent();            
        for(let i=0; i<4;i++)
        await page.locator(`//button[@title='Next ${type}']`).click();
        const cal2 = await page.locator("//h2").textContent();
        expect(cal1).not.toBe(cal2);
        await page.locator("//button[text()='today']").click();
        const cal3 = await page.locator("//h2").textContent();
        expect(cal3).toContain(cal1);
        console.log(type,cal1,cal2,cal3);
        console.log(`the ${type} button is validated`);
    }
})
test("Calendar View - Verifying records marked against days in a week",async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.calendar.click();
    await page.locator("//button[text()='week']").click();
    const cells = await page.locator('//td[@role="gridcell"]').all();
    for(let i=0; i < cells.length; i++){
        await cells[i].click();
        const data = await page.locator("//h5").textContent(); 
        try{expect(data,`date ${i}`).toContain('There are currently no records available.');}
        catch(Error){console.log(i)}
    }
})
test('validating previous month and next month navigation',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.calendar.click();
    let cal1 = await page.locator("//h2").textContent();
    while(cal1!='January 2023'){await page.locator('//button[@title="Previous month"]').click();
    cal1 = await page.locator("//h2").textContent();}
    console.log(cal1);     
    //UI comparison    
    await expect(page).toHaveScreenshot('image.png',{fullPage: true});      
    await page.locator('//button[@title="Next month"]').click();        
})
test('Chart - Expand & close options',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.masterDetails.click();
    await page.locator('i[class*="expand"]').nth(2).waitFor({state:"visible"});
    const expansion = await page.locator('i[class*="expand"]').all();
    const count = expansion.length;
    for(let i=0;i<count;i++){
    await page.locator('i[class*="expand"]').nth(i).click();
    await expect(page.locator('text="Download"')).toBeVisible();
    await page.locator('text="close"').click();
    }
})
test('validating dashboard url, text content and discard',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.masterDetails.click();
    await list.masterDetailsDashboard.click();
    // await expect(page).toHaveURL(`${baseUrl}fgPage/1c87e5c3-9e88-4e5b-87e8-2c7f63c28169/44b4eb67-f5b8-482b-934f-a03d7f8796be/detail/2cd79090-eec7-4806-9445-ce2a7df58d89?id=%7B%22BILL_NAME%22:%22Test01%22,%22BILL_TO_GST%22:%2200265356%22,%22INVOICE_TO_PIN_CODE%22:%22600100%22,%22REFERENCE_ID%22:%22INV20230906499765%22,%22SUB_TYPE_CODE%22:%22FG_INVOICES%22,%22CUSTOMER_REFERENCE%22:%2224041311167000042529377.30%22,%22DUE_AMOUNT%22:null,%22INV_EMAIL%22:null,%22INVOICE_DATE%22:%222023-09-07%22,%22AMOUNT%22:null,%22DATE_DELIVERED%22:null,%22RADIO_FIELD%22:null,%22TYPE_CODE%22:%22FG_DEMO%22,%22ID%22:%2238b49194-0e51-4c09-8cf6-803e40d0a814%22,%22PROCESS_ID%22:%2237915c62-4ca2-11ee-bbb4-346f24208dd3%22,%22CREATED_BY%22:882,%22LAST_UPDATED_BY%22:883,%22GST_AMOUNT%22:null,%22LINE_ITEM_DISCOUNT_AMT%22:null,%22BILL_FROM%22:null,%22IS_TEMPLATE%22:false,%22LAST_UPDATED_ON%22:%222023-09-06T11:12:58.432Z%22,%22LAST_AUTHORISED_ON%22:%222023-09-06T11:12:58.416Z%22,%22LINE_ITEM_AMT_BASE%22:null,%22NAME%22:%22Assam%22,%22LINE_ITEM_AMT%22:null,%22TOTAL_TAX%22:null,%22ANCHOR_CODE%22:null,%22BILL_TYPE%22:null,%22PRODUCT_STATUS%22:%22Below%202000%22,%22ISSUING_PARTY_CODE%22:%22FINGRESS%22,%22ADDRESS%22:%22ASSAM%22,%22CREATED_ON%22:%222023-09-06T10:41:47.024Z%22,%22EMAIL_ID%22:null,%22LINE_NO%22:null,%22INV_NUMBER%22:%22TEST0005%22,%22TASK_ID%22:%2237915c81-4ca2-11ee-bbb4-346f24208dd3%22,%22APPLICANT_PARTY_CODE%22:%22AMAZON%22,%22INV_NAME%22:%22360%20Networks%22,%22IDENTIFIER_KEY%22:%22%7B%5C%22VERSION_ID%5C%22:1,%5C%22REFERENCE_ID%5C%22:%5C%22INV20230906499765%5C%22,%5C%22ID%5C%22:%5C%2238b49194-0e51-4c09-8cf6-803e40d0a814%5C%22%7D%22,%22STAGE_CODE%22:%22INITIATION%22,%22CURRENCY_CODE%22:null,%22BENE_ACC_NUMBER%22:null,%22DESCRIPTION%22:null,%22DEBIT_ACC_NUMBER%22:null,%22LAST_AUTHORISED_BY%22:883,%22ICON%22:null,%22BILL_ADDR3%22:null,%22IS_MASTER_VERSION%22:false,%22BILL_PHONE%22:null,%22CITY_1%22:%22Chennai%22,%22BILL_ADDR1%22:null,%22TOTAL_TAX_BASE%22:null,%22BILL_ADDR2%22:null,%22INV_STATUS%22:null,%22ACTIVE_CODE%22:%22ACTV%22,%22COUNTERPARTY_CODE%22:null,%22INV_ADDRESS1%22:%22A1%22,%22DUE_DATE%22:%222023-09-08T00:00:00.000Z%22,%22INV_ADDRESS3%22:null,%22APPLICANT_PARTY%22:%22AMAZON%22,%22INV_ADDRESS2%22:null,%22CREATED_NAME%22:%22Rajamanickam%20Ramachandran%22,%22BENE_NAME%22:%22AMAZON%22,%22STATUS_CODE%22:%22REJECTED%22,%22BILL_TO_PIN_CODE%22:%22629401%22,%22UPLOAD_REF_ID%22:null,%22VERSION_ID%22:1,%22BILL_TO%22:null,%22BILLING_PERIOD%22:null,%22CITY%22:%22Delhi%22,%22BILL_EMAIL%22:null,%22DISCOUNT_AMOUNT%22:null,%22INV_PHONE%22:null,%22DMS_ID%22:null%7D&viewMode=view`);
    for(let i=0;i<27;i++){
        await expect(page.locator('div[class="form-group"]').nth(i)).toBeVisible();
        const text = await page.locator('div[class="form-group"]').nth(i).textContent();
        console.log(text);
    }   
    await page.locator('text="Discard"').nth(0).click();
    // await expect(page).toHaveURL(`${baseUrl}fgPage/1c87e5c3-9e88-4e5b-87e8-2c7f63c28169/44b4eb67-f5b8-482b-934f-a03d7f8796be/detail/be760656-b999-4a42-bd20-5276c0f9f9e6`);
})
test('validating check boxes, search box & date in dashboard',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.masterDetails.click();
    await list.masterDetailsDashboard.click();
    await page.locator('span[class*="mat-checkbox-inner-container"]').nth(0).click();
    await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(1)).toBeChecked();
    await page.locator('span[class*="mat-checkbox-inner-container"]').nth(1).click();
    await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(0)).not.toBeChecked();
    await page.locator('input[class*="mat-input-element"]').nth(0).fill('djksbajdsbn');
    await expect(page.locator('text="Search"')).toBeVisible();
    await page.locator('text="Search"').click();
    await expect(page.locator('text="No Matching Data Found."')).toBeVisible();
    await page.locator('text="Clear"').click();
    await expect(page.locator('text="No Matching Data Found."')).not.toBeVisible();
    await expect(page.locator('text="Search"')).not.toBeVisible();
    await page.locator('text="calendar_today"').click();    
    await page.locator('text=" JUL "').click();    
    const yearMonth = await page.locator("button[aria-label*='Choose month']").textContent();    
    const day = await page.locator('text=" 7 "').textContent();
    await page.locator('text=" 7 "').click();
    await page.waitForTimeout(2000);
    const date = await page.locator('p span[class="ng-star-inserted"]').nth(7).textContent();
    console.log('entered date :' +day+":"+yearMonth+ " displayed date :"+date);    
})
test('Validating radio buttons ',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.masterDetails.click();
    await list.masterDetailsDashboard.click();
    for(let i=0;i<3;i++){
    await page.locator('span[class="mat-radio-container"]').nth(i).click();
    if(i==0){
        await expect(page.locator('.mat-radio-container').nth(i+1)).not.toBeChecked();
        await expect(page.locator('.mat-radio-container').nth(i+2)).not.toBeChecked();
    }
    else if(i==1){
        await expect(page.locator('.mat-radio-container').nth(i-1)).not.toBeChecked();
        await expect(page.locator('.mat-radio-container').nth(i+1)).not.toBeChecked();
    }
    else {
        await expect(page.locator('.mat-radio-container').nth(i-2)).not.toBeChecked();
        await expect(page.locator('.mat-radio-container').nth(i-1)).not.toBeChecked();
    }    
    }
})
test('validating test page and its options visibility',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.masterDetails.click();
    await list.masterDetailsDashboard.click();
    await page.locator('text="Test"').click();
    // await expect(page).toHaveURL(`${baseUrl}fgRequestList/e87cdbcd-a7d2-4ce6-bcea-f223d80145b3/44b4eb67-f5b8-482b-934f-a03d7f8796be`)
    await expect(page.locator('text="Default List "')).toBeVisible();
    await page.locator('text="cloud_download"').click();
    await expect(page.locator('text="picture_as_pdf"')).toBeVisible();
    await expect(page.locator('text="border_all"')).toBeVisible();
    await page.locator('text="picture_as_pdf"').click();
})
test("validating item per page in redirection",async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.masterDetails.click();
    await list.masterDetailsDashboard.click();
    await page.locator('text="Redirect"').click();
    // await expect(page).toHaveURL(`${baseUrl}fgRequestList/0b62dca4-d629-4ab3-ad4e-27c9217f64d1/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    for(let i=0; i<4; i++){
        await page.locator("div[class*='mat-select-arrow']").first().click();
        const count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
        await page.locator("span[class='mat-option-text']").nth(i).click();
        await page.waitForTimeout(2000);
        const noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();
        console.log(noOfcount);       
        await page.locator('button[class*="fg-icon-btn"]').nth(4).waitFor({state:"visible"});
            const no = await page.locator('button[class*="fg-icon-btn"]').all();
            const no1 = no.length/2;    
            if(i==3){console.log(no1);break;}
            expect(count).toContain(`${no1}`);            
            console.log(" No.of invoice " +no1);
        }
})

test('Validating the minimizing options in kanban',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.kanban.click();
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
test('Validating the maximizing options in kanban',async()=>{    
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.kanban.click();
    await page.locator("button[aria-label='minimize board']").nth(1).waitFor({state:"visible"});
    const no_of_fields =await page.locator("button[aria-label='minimize board']").all();
    const no=no_of_fields.length;  
    for(let i=0;i<no;i++){
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
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.kanban.click();   
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
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.kanban.click();
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
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.kanban.click();
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
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await list.kanban.click();
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


