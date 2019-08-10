export default textPrepared = (num, text) => {

  num = num ? num : 0;

  let firstLetter = ' ' + num + '';
  let moreThenTen = num > 10 ? true : false;
  let moreThenTwenty = num > 20 ? true : false;
  num = parseInt(firstLetter[firstLetter.length - 1]);

  if (firstLetter) {
    switch (text) {
      case 'Заказчик':
        if (num == 0 || num >= 5 || num == 1 && moreThenTen && !moreThenTwenty) {
          return 'Заказчиков';
        } else if (num == 1) {
          return 'Заказчик';
        } else if (num > 1 && num < 5) {
          return 'Заказчика';
        }
      break;
      case 'Исполнитель':
        if (num == 0 || num >= 5 || num == 1 && moreThenTen && !moreThenTwenty) {
          return 'Исполнителей';
        } else if (num == 1) {
          return 'Исполнитель';
        } else if (num > 1 && num < 5) {
          return 'Исполнителя';
        }
      break;
      case 'задача':
        if (num == 0 || num >= 5 || num == 1 && moreThenTen && !moreThenTwenty) {
          return 'Задач';
        } else if (num == 1) {
          return 'Задача';
        } else if (num > 1 && num < 5) {
          return 'Задачи';
        }
      break;
      case 'отзыв':
        if (num == 0 || num >= 5 || num == 1 && moreThenTen && !moreThenTwenty) {
          return 'отзывов';
        } else if (num == 1) {
          return 'отзыв';
        } else if (num > 1 && num < 5) {
          return 'отзыва';
        }
      break;
      case 'Запись':
        if (num == 0 || num >= 5 || num == 1 && moreThenTen && !moreThenTwenty) {
          return 'Записей';
        } else if (num == 1) {
          return 'Запись';
        } else if (num > 1 && num < 5) {
          return 'Записи';
        }
      break;
      case 'человек':
        if (num == 0 || num >= 5 || num == 1 && moreThenTen && !moreThenTwenty) {
          return 'человек';
        } else if (num == 1) {
          return 'человек';
        } else if (num > 1 && num < 5) {
          return 'человека';
        }
      break;
      case 'отклик':
        if (num == 0 || num >= 5 || (moreThenTen && !moreThenTwenty)) {
          return 'откликов';
        } else if (num == 1) {
          return 'отклик';
        } else if (num > 1 && num < 5) {
          return 'отклика';
        }
      break;
      case 'У вас осталось':
        if (num == 0 || num >= 5 || num == 1 && moreThenTen && !moreThenTwenty) {
          return 'У вас осталось';
        } else if (num == 1) {
          return 'У вас остался';
        } else if (num > 1 && num < 5) {
          return 'У вас осталось';
        }
      break;
      default:
          return text;
    }
  }
};