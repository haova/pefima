import db from './db';

export default ({ app }, inject) => {
  db.init();
  
  inject('db', db);
  
  inject('utils', {
    formatCurrency(amount, lang='vi-VN', currency='vnd'){
      const formatter = new Intl.NumberFormat(lang, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      });
      
      return formatter.format(amount);
    }
  });
}