const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0VOckRhMzVENGJOUlA5YzVNRExGMUFZNU9oSVd5cnRyVGFtUXA4eklVUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWlVDaHNYcEp5cUNaR01ubzFQSlZoVU1LQzJ6SlRzVEJTYkxOSXVIQVVYVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjQlVqdjlTNEJFUndzS1BPK1VuVTNVNnZxcytrZy9JNXBzU1p3VDl3SVdvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ3Zk10VklGTTBKeVFmUkx3ZUNNdEpidDF6RjdMckZDNElXZ2dsaU5MN1NBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndKWXhjWHpKMVpacTZCTVZvRVZmSXJMM0Z0YUVjQzRtOGRQRjZlVWRVVzQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ims0ZXFaanlsZWdCRmd3NVMwZGNmSGpuTnlkakN5VjBDSXBUVXRoY2ZZbDQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQUl0VXlNa0phYmFCU0VraGxFeUw3Rk1Ec0pUTDVjVVRqZGpKZ2JRZXpYND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieEFUbzB0ODA3QW9Oa04wWVAweXFLbXZVdHZuN1p6NndtZUJJblgzeFQzST0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImtPeGhLdmhXYXIxY2xhazR5QkhkTFEwSHFOdmJDNldqUGJIWWV5aXRPSUxjaHFWNTBuaE9CM2YySUMxRGdEZDd3ek5yV2E1dlVsR0xISU9acldYMUJnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NTgsImFkdlNlY3JldEtleSI6IjZ4VlY2RlhFOHRzamhRRE1yb0FXeDBZcHlWeDM0RHdJekFqaTN2cmYvcGM9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IllqeVBkcGpiUkZpYWl2WFJYLWJ1V2ciLCJwaG9uZUlkIjoiMTEzMTY2NmUtZGRkZC00ZTM3LTg4ZDktZWUzOTU3MmRiZjNkIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InBZVk16dWd0elBsb2JUcHhjZDYvVFNEaUsvbz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJVRVpENy9ONy9sdjl6VTBXRm55SnNiNXFYYU09In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiTDM2MVhTUjYiLCJtZSI6eyJpZCI6IjI1NTc0ODQwOTIxMjozMUBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJKb3ZpbiJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTUdZNDZjRUVOZTRvclVHR0FVZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiYVFObGI1bXBoVnBXY1d2V0NLbllMdjU0bGx2NTdldlNoNW9oajRUelBWcz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiak52Rk4vcHJ4cjNqeTdSWEM5L1czZlpsbWZ2RWROc0V5MnVWNndOMW9kSEMzY1A2dWxWODVmWmxINzlLVjZROWtaZ1JFbGprNkM2Nm5VczBrN2F6Q0E9PSIsImRldmljZVNpZ25hdHVyZSI6IjE3M2I4d0VhZUQwWmNreHFWbmp1UVhVa0pHTHNsWGFhSW9XY3l0a2h2MmNSSko2UmRVUm9xbTNuekYrNkp4Mm5CcjFiUTFyNXVRQml0bkhGWTFtWkJBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU1NzQ4NDA5MjEyOjMxQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQldrRFpXK1pxWVZhVm5GcjFnaXAyQzcrZUpaYitlM3Iwb2VhSVkrRTh6MWIifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjIzMjYxMTd9',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "France King",
    OWNER_NUMBER : process.env.OWNER_NUMBER || "255748409212", 
    A_REACT : process.env.AUTO_REACTION || 'on',     
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
CHATBOT: process.env.CHAT_BOT || "on",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    BOT : process.env.BOT_NAME || 'FLASH-MD',
    //OPENAI_API_KEY : process.env.OPENAI_API_KEY || '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',
    URL : process.env.BOT_MENU_LINKS || '',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'off',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    PRESENCE : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_MESSAGE || "on",
//    ADM : process.env.ANTI_DELETE_MESSAGE || 'off',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd" : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
