export default statusColor = (id, projects = false) => {

  id = id ? id.toString() : 0;

  // Определяем цвет статусов
  //console.warn(id)
  switch (id) {
    case '0':
      if (projects)
        return 'GRAY_STATUS' // Проект не активен
      return 'GRAY_STATUS' // неактивна
    break;
    case '1':
      if (projects)
        return 'GREEN_STATUS' // Проект активен
      return 'YELLOW_STATUS' // на согласовании с представителем
    break;
    case '2':
      return 'GREEN_STATUS' // одобрена представителем
    break;
    case '3':
      return 'RED_STATUS' // отклонена представителем
    break;
    case '4':
      return 'BLUE_STATUS' // в работе
    break;
    case '5':
      return 'GREEN_STATUS' // монтаж завершен
    break;
    case '6':
      return 'YELLOW_STATUS' // на согласовании с клиентом
    break;
    case '7':
      return 'GREEN_STATUS' // закрыта
    break;
    case '8':
      return 'RED_STATUS' // отклонена клиентом
    break;
    default:
        return 'GRAY_STATUS';
  }
};
