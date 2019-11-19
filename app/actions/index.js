import {
  getAllTasks,
  getAllSpectatorTasks,
  getImages,
  filterTasks,
  saveTask,
  changeStatus,
  savePhoto,
  setVisited
} from '../actions/tasks.js';

import {
  navigateToMainPage,
  navigateToLogin,
  navigateToDetail,
  navigateToFilter,
  navigateToEdit,
  navigateBack,
  navigateToProjects
} from '../actions/nav.js';

import {
  getUserProjects,
  getAllProjects,
  getAllSpectatorProjects,
  setProject,
} from '../actions/projects.js';

import {
  getUserCompanies,
  getAllCompanies,
  setCompany,
} from '../actions/companies.js';

import {
  getStatuses,
  getProjectStatuses
} from '../actions/statuses.js';

import {
  getTowns
} from '../actions/towns.js';

import {
  login,
  getUserStatuses,
  getTaskMasters,
  getAgents,
  sendPhoneToken
} from '../actions/user.js';

export {
  getAllTasks,
  getAllSpectatorTasks,
  getImages,
  filterTasks,
  saveTask,
  changeStatus,
  savePhoto,
  setVisited,

  navigateToDetail,
  navigateToMainPage,
  navigateToLogin,
  navigateToFilter,
  navigateToEdit,
  navigateBack,
  navigateToProjects,

  getUserProjects,
  getAllProjects,
  getAllSpectatorProjects,
  setProject,

  getUserCompanies,
  getAllCompanies,
  setCompany,

  getStatuses,
  getProjectStatuses,

  getTowns,

  login,
  getUserStatuses,
  getTaskMasters,
  getAgents,
  sendPhoneToken
};
