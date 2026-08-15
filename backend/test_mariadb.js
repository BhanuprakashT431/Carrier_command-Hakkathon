// Test MariaDB connectivity using mysql2 driver
const mysql = require('mysql2/promise');

const passwords = ['', 'root', 'admin', 'password', '123456', '12345', '1234', 'mariadb', 'mysql', 'Dell', 'DELL', 'dell'];

async function test() {
  for (const pw of passwords) {
    try {
      const conn = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: pw,
        connectTimeout: 3000
      });
      const [rows] = await conn.query('SELECT 1 as ok');
      console.log(`✅ Connected with password: "${pw}"`);
      await conn.end();
      return pw;
    } catch (e) {
      const msg = e.message || '';
      console.log(`❌ Password "${pw}": ${msg.split('\n')[0]}`);
    }
  }
  return null;
}

test().then(pw => {
  if (pw !== null) {
    console.log(`\nUSE THIS PASSWORD: "${pw}"`);
  } else {
    console.log('\nNo password worked');
  }
});
