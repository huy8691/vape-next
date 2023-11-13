import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Dialog,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import { Stack } from '@mui/system'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  ArrowRight,
  Gear,
  MagnifyingGlass,
  TrashSimple,
  X,
} from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  MenuAction,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  KEY_MODULE,
  PERMISSION_RULE,
  checkPermission,
  handlerGetErrMessage,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import {
  deleteAttribute,
  getAttribute,
  updateAttributeOption,
} from './apiAttributeOption'
import {
  AttributeDetailType,
  ListAttributeResponseType,
  SubmitUpdateAttributeOptionType,
} from './modelAttributeOption'
import { schema, schemaUpdateAttribute } from './validations'
import { useTranslation } from 'next-i18next'

const BoxModalCustom = styled(Box)(() => ({
  width: '400px',
  background: 'white',
  borderStyle: 'none',
  padding: '30px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}))
const AttributeOptionManagementComponent = () => {
  const { t } = useTranslation('attribute-option')
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [stateAttribute, setStateAttribute] =
    useState<ListAttributeResponseType>({ data: [] })
  const [stateCurrentAttribute, setStateCurrentAttribute] =
    useState<AttributeDetailType>()
  const [
    stateDrawerUpdateAttributeOption,
    setStateDrawerUpdateAttributeOption,
  ] = useState(false)

  const [stateDialogDeleteAttribute, setStateDialogDeleteAttribute] =
    useState(false)
  const [pushMessage] = useEnqueueSnackbar()
  const handleGetAttribute = (query: any) => {
    dispatch(loadingActions.doLoading())
    getAttribute({ ...query })
      .then((res) => {
        const { data } = res
        setStateAttribute(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    handleGetAttribute(router.query)
  }, [router.query])
  const {
    handleSubmit: handleSubmitSearch,
    control: controlSearch,
    formState: { errors: errorsSearch },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const {
    handleSubmit: handleSubmitUpdateAttributeOption,
    control: controlUpdateAttributeOption,
    register: registerUpdateAttributeOption,
    setValue: setValueUpdateAttributeOption,
    formState: { errors: errorsUpdateAttributeOption },
  } = useForm<SubmitUpdateAttributeOptionType>({
    resolver: yupResolver(schemaUpdateAttribute(t)),
    mode: 'all',
    reValidateMode: 'onChange',
    shouldUnregister: true,
  })
  const { fields, remove, append } = useFieldArray({
    control: controlUpdateAttributeOption,
    name: 'options',
  })

  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        name: values.name,
        page: 1,
      })}`,
    })
  }
  const handleChangePagination = (e: any, page: number) => {
    console.log(e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  //Menu Delete and edit
  const open = Boolean(anchorEl)

  const handleCloseMenu = () => {
    console.log('hehe')
    setAnchorEl(null)
  }

  const handleClickGear = (
    e: React.MouseEvent<HTMLElement>,
    item: AttributeDetailType
  ) => {
    setAnchorEl(e.currentTarget)
    setStateCurrentAttribute(item)
  }

  const handleCheckGear = () => {
    return checkPermission(
      arrayPermission,
      KEY_MODULE.Inventory,
      PERMISSION_RULE.CreateOption
    )
  }

  const handleSubmitDeleteAttribute = () => {
    if (!stateCurrentAttribute) return
    dispatch(loadingActions.doLoading())
    deleteAttribute(Number(stateCurrentAttribute.id))
      .then(() => {
        setStateDialogDeleteAttribute(false)
        handleGetAttribute(router.query)
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.deleteAttributeSuccessfully'), 'success')
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())

        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleOpenUpdateAttributeOption = () => {
    if (!stateCurrentAttribute) return
    setStateDrawerUpdateAttributeOption(true)
    setValueUpdateAttributeOption('options', stateCurrentAttribute.options)
    setValueUpdateAttributeOption('name', stateCurrentAttribute.name)
    setAnchorEl(null)
  }
  const onSubmitUpdateAttributeOption = (
    data: SubmitUpdateAttributeOptionType
  ) => {
    dispatch(loadingActions.doLoading())
    updateAttributeOption(Number(stateCurrentAttribute?.id), data)
      .then(() => {
        pushMessage(t('message.updateAttributeOptionSuccessfully'), 'success')
        handleGetAttribute({})
        setStateDrawerUpdateAttributeOption(false)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
    console.log('data', data)
  }
  const onErrorUpdateAttributeOption = (err: any) => {
    console.log('err', err)
  }
  return (
    <>
      <Grid container columnSpacing={'28px'}>
        <Grid xs>
          <form
            onSubmit={handleSubmitSearch(handleSearch)}
            className="form-search"
          >
            <Controller
              control={controlSearch}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="name"
                    error={!!errorsSearch.name}
                    placeholder={t('searchAttributeByName')}
                    {...field}
                  />
                </FormControl>
              )}
            />
            <IconButton
              aria-label="Search"
              type="submit"
              className="form-search__button"
            >
              <MagnifyingGlass size={20} />
            </IconButton>
          </form>
        </Grid>
        {checkPermission(
          arrayPermission,
          KEY_MODULE.Inventory,
          PERMISSION_RULE.CreateAttribute
        ) && (
          <Grid xs style={{ maxWidth: '288px' }}>
            <Link
              href={`/${platform().toLowerCase()}/inventory/attribute-option/create`}
            >
              <a>
                <ButtonCustom variant="contained" fullWidth size="large">
                  {t('addNewAttribute')}
                </ButtonCustom>
              </a>
            </Link>
          </Grid>
        )}
      </Grid>
      {stateAttribute.success && stateAttribute?.data?.length === 0 ? (
        <>
          <Grid container spacing={2} justifyContent="center">
            <Grid>
              <Stack
                p={5}
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={'/' + '/images/not-found.svg'}
                  alt="Logo"
                  width="200"
                  height="200"
                />
                <Typography variant="h6" sx={{ marginTop: '0' }}>
                  {t('thereAreNoAttributeAndOptionToShow')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws sx={{ textAlign: 'center' }}>No</TableCellTws>
                  <TableCellTws
                    sx={{
                      minWidth: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t('attributeName')}
                  </TableCellTws>
                  <TableCellTws sx={{ minWidth: '150px' }}>Option</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws sx={{ textAlign: 'right' }}>
                      {t('action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateAttribute?.data?.map((item, index) => {
                  return (
                    <TableRowTws key={`item-${index}`}>
                      <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                        {(router.query.limit
                          ? Number(router.query.limit)
                          : 10) *
                          (router.query.page ? Number(router.query.page) : 1) -
                          (router.query.limit
                            ? Number(router.query.limit)
                            : 10) +
                          index +
                          1}
                      </TableCellTws>
                      <TableCellTws>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {item.name ? item.name : 'N/A'}
                          </Typography>
                        </Stack>
                      </TableCellTws>
                      <TableCellTws>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          divider={
                            <Divider
                              orientation="vertical"
                              variant="middle"
                              flexItem
                            />
                          }
                        >
                          {item.options.map((element, idx) => {
                            return (
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                key={element.id + idx}
                                flexWrap="wrap"
                              >
                                <Typography>{element.name}</Typography>
                              </Stack>
                            )
                          })}
                        </Stack>
                      </TableCellTws>
                      {handleCheckGear() && (
                        <TableCellTws sx={{ textAlign: 'right' }}>
                          <IconButton onClick={(e) => handleClickGear(e, item)}>
                            <Gear size={24} />
                          </IconButton>
                        </TableCellTws>
                      )}
                    </TableRowTws>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainerTws>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Typography>{t('rowsPerPage')}</Typography>

            <FormControl sx={{ m: 1 }}>
              <SelectPaginationCustom
                value={
                  Number(router.query.limit) ? Number(router.query.limit) : 10
                }
                onChange={handleChangeRowsPerPage}
                displayEmpty
              >
                <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
                <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
                <MenuItemSelectCustom value={50}>50</MenuItemSelectCustom>
                <MenuItemSelectCustom value={100}>100</MenuItemSelectCustom>
              </SelectPaginationCustom>
            </FormControl>
            <Pagination
              color="primary"
              variant="outlined"
              shape="rounded"
              defaultPage={1}
              page={Number(router.query.page) ? Number(router.query.page) : 1}
              onChange={(event, page: number) =>
                handleChangePagination(event, page)
              }
              count={stateAttribute ? stateAttribute?.totalPages : 0}
            />
          </Stack>

          <MenuAction
            elevation={0}
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {/* <MenuItem>
              <Link
                href={`/${platform().toLowerCase()}/inventory/attribute-option/detail/${
                  stateCurrentAttribute?.id
                }`}
              >
                <a className="menu-item-action" style={{ textAlign: 'left' }}>
                  View details
                </a>
              </Link>
            </MenuItem> */}
            <MenuItem
              onClick={() => {
                handleOpenUpdateAttributeOption()
              }}
            >
              {t('updateAttributeOptions')}
            </MenuItem>
            {checkPermission(
              arrayPermission,
              KEY_MODULE.Inventory,
              PERMISSION_RULE.DeleteAttribute
            ) && (
              <MenuItem
                onClick={() => {
                  setAnchorEl(null)
                  setStateDialogDeleteAttribute(true)
                }}
              >
                {t('deleteAttribute')}
              </MenuItem>
            )}

            {/* <MenuItem onClick={handleCloseMenu}>Delete</MenuItem> */}
          </MenuAction>
        </>
      )}

      <Drawer
        anchor="right"
        open={stateDrawerUpdateAttributeOption}
        onClose={() => setStateDrawerUpdateAttributeOption(false)}
      >
        <BoxModalCustom sx={{ width: '500px', padding: '15px' }}>
          <Stack direction="row" spacing={2} sx={{ marginBottom: '15px' }}>
            <IconButton
              onClick={() => setStateDrawerUpdateAttributeOption(false)}
            >
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2
              sx={{
                fontSize: '2.4rem',
                textAlign: 'center',
              }}
            >
              {t('updateAttributeOptions')}
            </TypographyH2>
          </Stack>
          <form
            onSubmit={handleSubmitUpdateAttributeOption(
              onSubmitUpdateAttributeOption,
              onErrorUpdateAttributeOption
            )}
          >
            <Box sx={{ marginBottom: '15px' }}>
              <Box
                sx={{
                  background: '#F8F9FC',
                  padding: '15px',
                  borderRadius: '10px',
                }}
              >
                <Stack sx={{ marginBottom: '15px' }}>
                  <Typography sx={{ marginBottom: '10px', fontWeight: 500 }}>
                    {t('attribute')}
                  </Typography>
                  <Box
                    sx={{
                      background: '#fff',
                      padding: '15px',
                      borderRadius: '10px',
                    }}
                  >
                    <Controller
                      control={controlUpdateAttributeOption}
                      name="name"
                      render={(field) => {
                        return (
                          <>
                            <Box sx={{ marginBottom: '10px' }}>
                              <InputLabelCustom
                                htmlFor="name"
                                error={!!errorsUpdateAttributeOption.name}
                              >
                                {' '}
                                {t('attributeName')}
                                <RequiredLabel />
                              </InputLabelCustom>
                              <FormControl fullWidth>
                                <TextFieldCustom
                                  id="name"
                                  error={!!errorsUpdateAttributeOption.name}
                                  {...registerUpdateAttributeOption('name')}
                                  {...field}
                                />
                                <FormHelperText
                                  error={!!errorsUpdateAttributeOption.name}
                                >
                                  {errorsUpdateAttributeOption.name &&
                                    `${errorsUpdateAttributeOption.name.message}`}
                                </FormHelperText>
                              </FormControl>
                            </Box>
                          </>
                        )
                      }}
                    />
                  </Box>
                </Stack>
                <Stack>
                  <Typography sx={{ marginBottom: '10px', fontWeight: 500 }}>
                    {t('option')}
                  </Typography>
                  <Stack
                    spacing={2}
                    sx={{
                      background: '#fff',
                      padding: '15px',
                      marginBottom: '15px',
                      borderRadius: '10px',
                      height: '600px',
                      overflow: 'auto',
                    }}
                  >
                    {fields.map((item, index) => {
                      // setValueUpdateAttributeOption(
                      //   `options.${index}.id`,
                      //   item
                      // )
                      console.log('item.id', item.id)
                      return (
                        <Box key={item.id} sx={{ marginBottom: '10px' }}>
                          <Controller
                            control={controlUpdateAttributeOption}
                            name={`options.${index}.name`}
                            render={({ field }) => (
                              <>
                                <InputLabelCustom
                                  htmlFor={`arr_attributes.${index}.attribute`}
                                  error={
                                    !!errorsUpdateAttributeOption?.options?.[
                                      index
                                    ]?.name
                                  }
                                >
                                  <RequiredLabel />
                                  {t('optionName')} {index + 1}
                                </InputLabelCustom>
                                <FormControl fullWidth>
                                  <Stack direction="row" spacing={1}>
                                    <TextFieldCustom
                                      id={`options.${index}.name`}
                                      sx={{ width: '100%' }}
                                      error={
                                        !!errorsUpdateAttributeOption
                                          ?.options?.[index]?.name
                                      }
                                      {...field}
                                    />
                                    {fields.length !== 1 && (
                                      <IconButton
                                        onClick={() => {
                                          remove(index)
                                          // if (stateEnableConfig) {
                                          //   generateProductVariant()
                                          // }
                                        }}
                                      >
                                        <TrashSimple size={20} />
                                      </IconButton>
                                    )}
                                  </Stack>

                                  <FormHelperText error>
                                    {errorsUpdateAttributeOption?.options?.[
                                      index
                                    ]?.name &&
                                      errorsUpdateAttributeOption?.options?.[
                                        index
                                      ]?.name?.message}
                                  </FormHelperText>
                                </FormControl>
                              </>
                            )}
                          ></Controller>
                        </Box>
                      )
                    })}
                  </Stack>

                  <ButtonCustom
                    variant="outlined"
                    size="large"
                    sx={{ width: '50%', background: '#fff' }}
                    onClick={() => {
                      append({
                        id: null,
                        name: '',
                      })
                    }}
                  >
                    {t('append')}
                  </ButtonCustom>
                </Stack>
              </Box>
            </Box>
            <ButtonCustom variant="contained" type="submit" size="large">
              {t('submit')}
            </ButtonCustom>
          </form>
        </BoxModalCustom>
      </Drawer>

      <Dialog
        open={stateDialogDeleteAttribute}
        onClose={() => setStateDialogDeleteAttribute(false)}
      >
        <DialogTitleTws>
          <IconButton onClick={() => setStateDialogDeleteAttribute(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>

        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {`Delete attribute ${stateCurrentAttribute?.name}`}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>{t('areYouSureToDelete')}</DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => setStateDialogDeleteAttribute(false)}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleSubmitDeleteAttribute}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
    </>
  )
}

export default AttributeOptionManagementComponent
