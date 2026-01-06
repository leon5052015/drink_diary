// ⚠️ 您的 Google Sheets 試算表 ID
const SPREADSHEET_ID = '1UypZugiWsXORJKW6ybE5GIrgt0zcyfQDVv6jmSvKvBI';
const SHEET_NAME = 'Sheet1';

/**
 * 處理 OPTIONS 預檢請求 - 處理 CORS
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 處理 GET 請求 - 讀取所有記錄
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // 如果工作表不存在，建立它
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['日期', '店家', '飲料', '價格', 'ID']);
    }
    
    const lastRow = sheet.getLastRow();
    let data = [];
    
    if (lastRow > 1) {
      // 讀取所有資料，並過濾掉可能的空行
      const rawData = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
      data = rawData.filter(row => row[4]); // 確保 ID 欄位有值
    }
    
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return makeErrorResponse(error);
  }
}

/**
 * 處理 POST 請求 - 新增、編輯、刪除
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // 解析 JSON 資料
    const postData = JSON.parse(e.postData.contents);
    const { action, id, store, item, price, date } = postData;
    
    if (action === 'add') {
      const newId = id || 'ID' + Date.now();
      sheet.appendRow([date, store, item, price, newId]);
      return makeSuccessResponse('新增成功', newId);
      
    } else if (action === 'edit' || action === 'delete') {
      const lastRow = sheet.getLastRow();
      const data = sheet.getRange(1, 5, lastRow, 1).getValues(); // 只抓 ID 欄 (E列)
      
      let rowIndex = -1;
      for (let i = 0; i < data.length; i++) {
        if (String(data[i][0]) === String(id)) {
          rowIndex = i + 1;
          break;
        }
      }
      
      if (rowIndex === -1) throw new Error('找不到該筆記錄 ID: ' + id);
      
      if (action === 'edit') {
        sheet.getRange(rowIndex, 1, 1, 4).setValues([[date, store, item, price]]);
        return makeSuccessResponse('更新成功', id);
      } else {
        sheet.deleteRow(rowIndex);
        return makeSuccessResponse('刪除成功', id);
      }
    }
    
  } catch (error) {
    return makeErrorResponse(error);
  }
}

// 輔助函式：回傳成功 JSON
function makeSuccessResponse(msg, id) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: msg,
    id: id
  })).setMimeType(ContentService.MimeType.JSON);
}

// 輔助函式：回傳錯誤 JSON
function makeErrorResponse(error) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: error.toString()
  })).setMimeType(ContentService.MimeType.JSON);
}