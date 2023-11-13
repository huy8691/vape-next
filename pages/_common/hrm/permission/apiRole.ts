import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  listRoleResponseType,
  listBoundaryPermissionResponseType,
  listPermissionOfRoleResponseType,
  AssignPermissionType,
  ListRoleTypesResponseType,
  RoleTypeDetailResponseType,
} from './roleModel'

const getListRole = (
  params?: object
): Promise<AxiosResponse<listRoleResponseType>> => {
  return callAPIWithToken({
    url: '/api/roles/',
    method: 'GET',
    params: {
      ...params,
    },
  })
}

const getListParentRole = (
  params?: object
): Promise<AxiosResponse<listRoleResponseType>> => {
  return callAPIWithToken({
    url: '/api/roles/',
    method: 'GET',
    params: {
      ...params,
    },
  })
}

const getListPermissionOfRole = (
  idRole: number,
  param: object
): Promise<AxiosResponse<listPermissionOfRoleResponseType>> => {
  return callAPIWithToken({
    url: `/api/role-permissions/?role=${idRole}`,
    method: 'GET',
    params: {
      ...param,
    },
  })
}
const getListRoleTypeOfRole = (
  idRole: number
): Promise<AxiosResponse<ListRoleTypesResponseType>> => {
  return callAPIWithToken({
    url: `/api/role-types/?role=${idRole}`,
    method: 'GET',
  })
}
const getListBoundaryRole = (
  idRole: number,
  param: object
): Promise<AxiosResponse<listBoundaryPermissionResponseType>> => {
  return callAPIWithToken({
    url: `/api/boundary-permissions/?role=${idRole}`,
    method: 'GET',
    params: {
      ...param,
    },
  })
}

const assignRolePermission = (
  id: number,
  data: AssignPermissionType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/roles/${id}/assign-permissions/`,
    method: 'post',
    data: data,
  })
}

const getDetailRoleTypes = (
  id: number
): Promise<AxiosResponse<RoleTypeDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/role-types/${id}/`,
    method: 'GET',
  })
}

export {
  getListRole,
  getListParentRole,
  getListBoundaryRole,
  getListPermissionOfRole,
  assignRolePermission,
  getListRoleTypeOfRole,
  getDetailRoleTypes,
}
