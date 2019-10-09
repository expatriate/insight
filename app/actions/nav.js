import { NavigationActions } from "react-navigation";

/// ROUTES

export const navigateToRegistration = () =>
NavigationActions.navigate({
  routeName: 'Registration',
});

export const navigateToLogin = () =>
NavigationActions.navigate({
  routeName: 'Login',
});

export const navigateToFilter = () =>
NavigationActions.navigate({
  routeName: 'Filter',
});

export const navigateToEdit = (task) =>
NavigationActions.navigate({
  routeName: 'Edit',
  params: {
    task: task,
  },
  key: 'Edit_' + task.id + new Date().getTime()
});

export const navigateToProjects = (companyid) =>
NavigationActions.navigate({
  routeName: 'Projects',
  params: {
    companyid: companyid,
  },
  key: 'Project_' + companyid + new Date().getTime()
});

export const navigateToDetail = (task) =>
NavigationActions.navigate({
  routeName: 'Detail',
  params: {
    task: task,
  },
  key: 'Detail_' + task.id + new Date().getTime()
});

export const navigateToForget = () =>
NavigationActions.navigate({
  routeName: 'ForgetPassword',
});

export const navigateToCreateTask = () =>
NavigationActions.navigate({
  routeName: 'CreateTask',
});

export const navigateToMainPage = (projectid) =>
NavigationActions.navigate({
  routeName: 'Main',
  params: {
    projectid: projectid,
  },
  key: 'Main_' + projectid + new Date().getTime()
});

export const navigateToMyReviews = () =>
NavigationActions.navigate({
  routeName: 'MyReviews',
});

export const navigateToMyTeam = () =>
NavigationActions.navigate({
  routeName: 'MyTeam',
});

export const navigateToMyFinance = () =>
NavigationActions.navigate({
  routeName: 'MyFinance',
});

export const navigateToMyFinanceRecharge = () =>
NavigationActions.navigate({
  routeName: 'MyFinanceRecharge',
});

export const navigateToEditTask = (taskid) =>
NavigationActions.navigate({
  routeName: 'EditTask',
  params: {
    taskid: taskid,
  },
  key: 'TaskEdit_' + taskid + new Date().getTime()
});

export const navigateToProfileUpgrade = () =>
NavigationActions.navigate({
  routeName: 'ProfileUpgrade',
})

export const navigateToFirstJoin = () =>
NavigationActions.navigate({
  routeName: 'FirstJoin',
});

export const navigateToTasksCatalogPage = () =>
NavigationActions.navigate({
  routeName: 'TasksCatalog',
});

export const navigateToUser = (userid, title) =>
NavigationActions.navigate({
  routeName: 'User',
  params: {
    userid: userid,
    title: title,
    template: 'dark'
  },
  key: 'User_' + userid + new Date().getTime()
});

export const navigateToMyTasks = (tab) =>
NavigationActions.navigate({
  routeName: 'MyTasks',
  params: {
    tab: tab ? tab : undefined
  }
});

export const navigateToSelectPerformer = (task) =>
NavigationActions.navigate({
  routeName: 'SelectPerformer',
  params: {
    task: task,
  },
  key: 'TaskPerformer_' + task.id + new Date().getTime()
});

export const navigateToTask = (taskid, title, back) =>
NavigationActions.navigate({
  routeName: 'TaskDetail',
  params: {
    taskid: taskid,
    title: title,
    template: 'light',
    back: back
  },
  key: 'Task_' + taskid + new Date().getTime()
});

export const navigateToTasksFilter = (mytasks) =>
NavigationActions.navigate({
  routeName: 'TasksFilter',
  params: {
    mytasks: mytasks ? true : false,
  },
});

export const navigateBack = (key) =>
NavigationActions.back({
  key: key || null,
});

export const navigateTo = (key) =>
NavigationActions.navigate({
  routeName: key,
});

export const navigateToStart = () =>
  NavigationActions.navigate({
    routeName: 'Start',
});

export const navigateToProfile = () =>
NavigationActions.navigate({
  routeName: 'Profile',
});
export const navigateToTasks = () =>
NavigationActions.navigate({
  routeName: 'MyTasks',
});

export const navigateToPerformersCatalog = () =>
NavigationActions.navigate({
  routeName: 'PerformersCatalog',
});

export const navigateToPerformersCatalogFilter = () =>
NavigationActions.navigate({
  routeName: 'PerformersCatalogFilter',
});

export const navigateToMyTeamFilterPage = () =>
NavigationActions.navigate({
  routeName: 'MyteamFilter',
});

export const navigateToTags = (routeFrom) =>
NavigationActions.navigate({
  routeName: 'Tags',
  params: {
    from: routeFrom && routeFrom.routeName ? routeFrom.routeName : null,
    key: routeFrom && routeFrom.key ? routeFrom.key : null,
    params: routeFrom && routeFrom.params ? routeFrom.params : null,
  }
});
