/**
 * 手搖日記 - Google Apps Script 後端 API
 * 
 * 功能：
 * - GET: 讀取所有記錄
 * - POST: 新增、編輯、刪除記錄
 * 
 * 使用說明：
 * 1. 將此程式碼貼到 Apps Script 編輯器
 * 2. 試算表 ID 已設定為：1UypZugiWsXORJKW6ybE5GIrgt0zcyfQDVv6jmSvKvBI
 * 3. 部署為網頁應用程式
 * 4. 設定「具有存取權的使用者」為「任何人」
 */

// ⚠️ 您的 Google Sheets 試算表 ID
const SPREADSHEET_ID = '1UypZugiWsXORJKW6ybE5GIrgt0zcyfQDVv6jmSvKvBI';
const SHEET_NAME = 'Sheet1'; // 預設工作表名稱，如果您的試算表有不同名稱請修改

/**
 * 處理 GET 請求 - 讀取所有記錄
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // 如果工作表不存在，建立它
    if (!sheet) {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = ss.insertSheet(SHEET_NAME);
      // 設定標題列
      newSheet.getRange(1, 1, 1, 5).setValues([['日期', '店家', '飲料', '價格', 'ID']]);
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 讀取所有資料（跳過標題列）
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      // 如果只有標題列或沒有資料，返回空陣列
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
    
    // 過濾空行
    const filteredData = data.filter(row => row[0] !== '' && row[1] !== '');
    
    return ContentService.createTextOutput(JSON.stringify(filteredData))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('GET 錯誤: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      error: error.toString(),
      message: '讀取資料時發生錯誤'
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理 POST 請求 - 新增、編輯、刪除記錄
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // 如果工作表不存在，建立它
    if (!sheet) {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = ss.insertSheet(SHEET_NAME);
      // 設定標題列
      newSheet.getRange(1, 1, 1, 5).setValues([['日期', '店家', '飲料', '價格', 'ID']]);
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true, 
        message: '工作表已建立' 
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 確保有標題列
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([['日期', '店家', '飲料', '價格', 'ID']]);
    }
    
    // 解析請求資料
    let postData = {};
    
    // 嘗試從 FormData 讀取
    if (e.parameter) {
      postData = {
        action: e.parameter.action,
        id: e.parameter.id,
        store: e.parameter.store,
        item: e.parameter.item,
        price: e.parameter.price,
        date: e.parameter.date
      };
    } else if (e.postData && e.postData.contents) {
      // 嘗試從 JSON 讀取
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (parseError) {
        Logger.log('JSON 解析錯誤: ' + parseError.toString());
        return ContentService.createTextOutput(JSON.stringify({ 
          error: '資料格式錯誤',
          message: parseError.toString()
        }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    const action = postData.action;
    const id = postData.id;
    
    // 根據動作執行不同操作
    if (action === 'add') {
      return handleAdd(sheet, postData);
    } else if (action === 'edit') {
      return handleEdit(sheet, postData, id);
    } else if (action === 'delete') {
      return handleDelete(sheet, id);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ 
        error: '未知的操作: ' + (action || '未提供')
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    Logger.log('POST 錯誤: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      error: error.toString(),
      message: '處理請求時發生錯誤'
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理新增記錄
 */
function handleAdd(sheet, data) {
  try {
    const date = data.date || new Date().toISOString().split('T')[0];
    const store = data.store || '';
    const item = data.item || '';
    const price = parseFloat(data.price) || 0;
    const id = data.id || 'ID' + Date.now();
    
    // 驗證必填欄位
    if (!store || !item) {
      return ContentService.createTextOutput(JSON.stringify({ 
        error: '店家名稱和飲料名稱為必填' 
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 新增資料到最後一行
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, 5).setValues([[date, store, item, price, id]]);
    
    Logger.log('新增記錄: ' + JSON.stringify({ date, store, item, price, id }));
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      id: id,
      message: '記錄已新增' 
    }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('新增錯誤: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      error: error.toString(),
      message: '新增記錄時發生錯誤'
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理編輯記錄
 */
function handleEdit(sheet, data, id) {
  try {
    if (!id) {
      return ContentService.createTextOutput(JSON.stringify({ 
        error: '缺少記錄 ID' 
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 尋找要編輯的記錄
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(JSON.stringify({ 
        error: '找不到記錄' 
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const idColumn = 5; // E 欄是 ID
    const idRange = sheet.getRange(2, idColumn, lastRow - 1, 1);
    const idValues = idRange.getValues();
    
    let rowIndex = -1;
    for (let i = 0; i < idValues.length; i++) {
      if (idValues[i][0] === id || String(idValues[i][0]) === String(id)) {
        rowIndex = i + 2; // +2 因為跳過標題列且陣列從 0 開始
        break;
      }
    }
    
    if (rowIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({ 
        error: '找不到 ID 為 ' + id + ' 的記錄' 
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 更新資料
    const date = data.date || sheet.getRange(rowIndex, 1).getValue();
    const store = data.store || sheet.getRange(rowIndex, 2).getValue();
    const item = data.item || sheet.getRange(rowIndex, 3).getValue();
    const price = parseFloat(data.price) || sheet.getRange(rowIndex, 4).getValue();
    
    sheet.getRange(rowIndex, 1, 1, 4).setValues([[date, store, item, price]]);
    
    Logger.log('編輯記錄: ' + JSON.stringify({ id, date, store, item, price }));
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      id: id,
      message: '記錄已更新' 
    }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('編輯錯誤: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      error: error.toString(),
      message: '編輯記錄時發生錯誤'
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理刪除記錄
 */
function handleDelete(sheet, id) {
  try {
    if (!id) {
      return ContentService.createTextOutput(JSON.stringify({ 
        error: '缺少記錄 ID' 
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 尋找要刪除的記錄
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(JSON.stringify({ 
        error: '找不到記錄' 
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const idColumn = 5; // E 欄是 ID
    const idRange = sheet.getRange(2, idColumn, lastRow - 1, 1);
    const idValues = idRange.getValues();
    
    let rowIndex = -1;
    for (let i = 0; i < idValues.length; i++) {
      if (idValues[i][0] === id || String(idValues[i][0]) === String(id)) {
        rowIndex = i + 2; // +2 因為跳過標題列且陣列從 0 開始
        break;
      }
    }
    
    if (rowIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({ 
        error: '找不到 ID 為 ' + id + ' 的記錄' 
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 刪除該行
    sheet.deleteRow(rowIndex);
    
    Logger.log('刪除記錄: ID = ' + id);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      id: id,
      message: '記錄已刪除' 
    }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('刪除錯誤: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      error: error.toString(),
      message: '刪除記錄時發生錯誤'
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 測試函數（可選，用於測試）
 */
function testGet() {
  const result = doGet({});
  Logger.log(result.getContent());
}

function testPost() {
  const testData = {
    parameter: {
      action: 'add',
      id: 'TEST' + Date.now(),
      store: '測試店家',
      item: '測試飲料',
      price: 50,
      date: new Date().toISOString().split('T')[0]
    }
  };
  const result = doPost(testData);
  Logger.log(result.getContent());
}
