import React, { useEffect, useMemo } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat, PatternFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
} from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'

import { styled } from '@mui/material/styles'
import {
  formatPhoneNumber,
  hasSpecialCharacterPrice,
  platform,
} from 'src/utils/global.utils'
import { ContactType } from './contactModel'
import classes from './styles.module.scss'
import { schema, schemaUpdate } from './validations'
import { useTranslation } from 'next-i18next'

interface Props {
  contactDetails?: any
  handleSubmit: (value: any) => void
  update?: boolean
  dataTypeOfLead?: { id: number; name: string }[]
  dataSource?: { id: number; name: string }[]
  dataSaleStatus?: { id: number; name: string }[]
  dataContactType?: { id: number; name: string }[]
  dataContactOption?: { id: number; name: string }[]
  expectedRevenue?: number
}

const NumericFormatCustom = styled(NumericFormat)<any>(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    overflow: 'hidden',
    borderColor: '#E1E6EF',
    height: '40px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
    borderColor: '#E1E6EF',
  },
  '& .MuiInputBase-multiline': {
    padding: '0px',
  },
  '& .MuiInputBase-input': {
    padding: '10px 15px',
  },
}))

const CreateUpdateComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('contact')
  const [stateValueTypeOfLead, setStateValueTypeOfLead] =
    React.useState<string>()

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    resetField,
    trigger,
    formState: { errors },
  } = useForm<ContactType>({
    resolver: yupResolver(props.update ? schemaUpdate(t) : schema(t)),
    mode: 'all',
  })

  /* Checking if the dataSource is empty or not. */
  const isDisabledSource = useMemo(
    () => (props.dataSource && props.dataSource.length > 0 ? false : true),
    [props.dataSource]
  )

  /* Checking if the dataTypeOfLead is empty or not. */
  // const isDisabledTypeOfLead = useMemo(
  //   () =>
  //     props.dataTypeOfLead && props.dataTypeOfLead.length > 0 ? false : true,
  //   [props.dataTypeOfLead]
  // )

  /**
   * It takes a string value, finds the object in the array that has the same name as the value, and then
   * sets the state to the name of that object
   */
  const handleChangeTypeOfLead = (event: any) => {
    if (!props.dataTypeOfLead) return
    setValue('type_of_lead', Number(event.target.value))

    const idTypeOfLead = Number(getValues('type_of_lead')) - 1

    setStateValueTypeOfLead(props.dataTypeOfLead[idTypeOfLead].name)
    resetField('lead_other')
  }

  /**
   * It takes a string value, finds the object in the array that has the same name as the value, and then
   * sets the state to the name of that object
   */

  useEffect(() => {
    if (props.update) {
      setValue('business_name', props.contactDetails?.business_name)
      setValue('first_name', props.contactDetails?.first_name)
      setValue('last_name', props.contactDetails?.last_name)
      setValue(
        'phone_number',
        formatPhoneNumber(props.contactDetails?.phone_number)
      )
      setValue('address', props.contactDetails?.address)
      setValue('federal_tax_id', props.contactDetails?.federal_tax_id)
      setValue('expected_revenue', props.contactDetails?.expected_revenue)
      if (props.contactDetails?.type_of_lead === null) {
        return
      }
      if (props.contactDetails?.type_of_lead) {
        setValue('type_of_lead', props.contactDetails?.type_of_lead.id)
        if (props.contactDetails?.type_of_lead.id === 1) {
          setStateValueTypeOfLead('OTHER')
          setValue('lead_other', props.contactDetails?.lead_other)
        }
      }
      // setValue('type_of_lead', props.contactDetails.type_of_lead)
    }

    // if (!props.update) {
    //   setValue('contact_option', 1)
    //   setValue('contact_status', 1)
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.update, props.contactDetails])

  /**
   * We're taking the data from the form, and and create contact from this
   */
  const onSubmit = (data: ContactType) => {
    /* Checking if the type_of_lead is empty and if it is, it deletes it from the data object. */
    if (data.type_of_lead === 0) {
      delete data.type_of_lead
    }
    /* Checking if the source is empty and if it is, it deletes the source property from the data object. */
    if (data.source === null) {
      delete data.source
    }

    /* Creating a new object with the same properties as the data object, but it is also edit a new property. */
    const contactCreated: ContactType = {
      ...data,
      email: data.email ? data.email : null,
      phone_number: data.phone_number
        .replace('(', '')
        .replace(')', '')
        .replaceAll(' ', ''),
      expected_revenue: Number(
        `${getValues('expected_revenue')}`.replace(/,/g, '')
      ),
    }
    props.handleSubmit(contactCreated)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          columnSpacing={3}
          mb={2}
          rowSpacing={2}
          sx={{ maxWidth: '1000px' }}
        >
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="business_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="business_name"
                      sx={{ marginBottom: '10px' }}
                      error={!!errors.business_name}
                    >
                      <RequiredLabel />
                      {t('createUpdate.businessName')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="business_name"
                        error={!!errors.business_name}
                        {...field}
                        placeholder={t('createUpdate.enterBusinessName')}
                      />
                      <FormHelperText error={!!errors.business_name}>
                        {errors.business_name &&
                          `${errors.business_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="federal_tax_id"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="federal_tax_id"
                      sx={{ marginBottom: '10px' }}
                      error={!!errors.federal_tax_id}
                    >
                      <RequiredLabel />
                      {t('createUpdate.federalTaxId')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="federal_tax_id"
                        error={!!errors.federal_tax_id}
                        {...field}
                        placeholder={t('createUpdate.enterFederalTaxId')}
                      />
                      <FormHelperText error={!!errors.federal_tax_id}>
                        {errors.federal_tax_id &&
                          `${errors.federal_tax_id.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="first_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="first_name"
                      sx={{ marginBottom: '10px' }}
                      error={!!errors.first_name}
                    >
                      <RequiredLabel />
                      {t('createUpdate.firstName')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="first_name"
                        error={!!errors.first_name}
                        {...field}
                        placeholder={t('createUpdate.enterFirstName')}
                      />
                      <FormHelperText error={!!errors.first_name}>
                        {errors.first_name && `${errors.first_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="last_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="last_name"
                      sx={{ marginBottom: '10px' }}
                      error={!!errors.last_name}
                    >
                      <RequiredLabel />
                      {t('createUpdate.lastName')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="last_name"
                        error={!!errors.last_name}
                        {...field}
                        placeholder={t('createUpdate.enterFirstName')}
                      />
                      <FormHelperText error={!!errors.last_name}>
                        {errors.last_name && `${errors.last_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="phone_number"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="phone_number"
                      sx={{ marginBottom: '10px' }}
                      error={!!errors.phone_number}
                    >
                      <RequiredLabel />
                      {t('createUpdate.phoneNumber')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <div className={classes['input-number']}>
                        <PatternFormat
                          id="phone_number"
                          customInput={TextField}
                          {...field}
                          error={!!errors.phone_number}
                          placeholder={t('createUpdate.enterPhoneNumber')}
                          format="(###) ### ####"
                        />
                      </div>

                      <FormHelperText error={!!errors.phone_number}>
                        {errors.phone_number &&
                          `${errors.phone_number.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="address"
                      sx={{ marginBottom: '10px' }}
                      error={!!errors.address}
                    >
                      <RequiredLabel />
                      {t('createUpdate.address')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="address"
                        error={!!errors.address}
                        {...field}
                        placeholder={t('createUpdate.enterAddress')}
                      />
                      <FormHelperText error={!!errors.address}>
                        {errors.address && `${errors.address.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Controller
              control={control}
              name="type_of_lead"
              defaultValue={0}
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="type_of_lead"
                    sx={{ marginBottom: '10px' }}
                    error={!!errors.type_of_lead}
                  >
                    {t('createUpdate.leadSource')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <SelectCustom
                      id="type_of_lead"
                      displayEmpty
                      IconComponent={() => <KeyboardArrowDownIcon />}
                      {...field}
                      onChange={handleChangeTypeOfLead}
                      renderValue={(value: any) => {
                        if (!value) {
                          console.log('hehehe????', value)

                          return (
                            <PlaceholderSelect>
                              <div>{t('createUpdate.selectValue')}</div>
                            </PlaceholderSelect>
                          )
                        }
                        return props.dataTypeOfLead?.find(
                          (obj) => obj.id === value
                        )?.name
                      }}
                    >
                      {props?.dataTypeOfLead?.map((item, index) => {
                        return (
                          <MenuItemSelectCustom
                            value={item.id}
                            key={index + Math.random()}
                          >
                            {item.name}
                          </MenuItemSelectCustom>
                        )
                      })}
                    </SelectCustom>
                    <FormHelperText error={!!errors.type_of_lead}>
                      {errors.type_of_lead && `${errors.type_of_lead.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
            {stateValueTypeOfLead === 'OTHER' && (
              <Controller
                control={control}
                name="lead_other"
                render={({ field }) => (
                  <>
                    <Box mt={1}>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="lead_other"
                          error={!!errors.lead_other}
                          placeholder={t('createUpdate.inputLeadSource')}
                          {...field}
                        />
                        {errors.lead_other && (
                          <FormHelperText error={!!errors.lead_other}>
                            {errors.lead_other &&
                              `${errors.lead_other.message}`}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                )}
              />
            )}
          </Grid>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="expected_revenue"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="expected_revenue"
                      sx={{ marginBottom: '10px' }}
                      error={!!errors.expected_revenue}
                    >
                      {t('createUpdate.expectedRevenue')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <NumericFormatCustom
                        id="expected_revenue"
                        placeholder="0"
                        {...field}
                        thousandSeparator=","
                        allowNegative={false}
                        onValueChange={(event: any) =>
                          setValue('expected_revenue', event.floatValue)
                        }
                        onKeyPress={(event: any) => {
                          if (hasSpecialCharacterPrice(event.key)) {
                            event.preventDefault()
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        decimalScale={2}
                        error={!!errors.expected_revenue}
                        customInput={TextField}
                      />
                      <FormHelperText error={!!errors.expected_revenue}>
                        {errors.expected_revenue &&
                          `${errors.expected_revenue.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>

          {!props.update && (
            <Grid container xs={12}>
              <Grid xs={6}>
                <Box>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="email"
                          sx={{ marginBottom: '10px' }}
                          error={!!errors.email}
                        >
                          {t('createUpdate.email')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="email"
                            error={!!errors.email}
                            {...field}
                            placeholder={t('createUpdate.enterEmail')}
                          />
                          <FormHelperText error={!!errors.email}>
                            {errors.email && `${errors.email.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="contact_type"
                  defaultValue={undefined}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="contact_type"
                        sx={{ marginBottom: '10px' }}
                        error={!!errors.contact_type}
                      >
                        <RequiredLabel />
                        {t('createUpdate.contactType')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="contact_type"
                          displayEmpty
                          disabled={isDisabledSource}
                          error={!!errors.contact_type}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (!value) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('createUpdate.selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            // handleChangeSource(value)
                            return props.dataContactType?.find(
                              (obj) => obj.id === value
                            )?.name
                          }}
                          {...field}
                          onChange={(event: any) => {
                            console.log('event', event.target.value)
                            setValue('contact_type', event.target.value)
                            trigger('contact_type')
                          }}
                        >
                          {props?.dataContactType?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.name}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.contact_type}>
                          {errors.contact_type &&
                            `${errors.contact_type.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>

              <Grid xs={6}>
                <Controller
                  control={control}
                  name="contact_status"
                  defaultValue={undefined}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="contact_status"
                        sx={{ marginBottom: '10px' }}
                        error={!!errors.contact_status}
                      >
                        <RequiredLabel />
                        {t('createUpdate.selectStatus')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="contact_status"
                          displayEmpty
                          disabled={isDisabledSource}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          {...field}
                          renderValue={(value: any) => {
                            if (!value) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('createUpdate.selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            // handleChangeSource(value)
                            return props.dataSaleStatus?.find(
                              (obj) => obj.id === value
                            )?.name
                          }}
                          error={!!errors.contact_status}
                          onChange={(event: any) => {
                            console.log('event', event.target.value)
                            setValue('contact_status', event.target.value)
                            trigger('contact_status')
                          }}
                        >
                          {props?.dataSaleStatus?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.name}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.contact_status}>
                          {errors.contact_status &&
                            `${errors.contact_status.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="contact_option"
                  defaultValue={undefined}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="contact_option"
                        sx={{ marginBottom: '10px' }}
                        error={!!errors.contact_option}
                      >
                        <RequiredLabel />
                        {t('createUpdate.wonLost')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="contact_option"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          {...field}
                          error={!!errors.contact_option}
                          renderValue={(value: any) => {
                            if (!value) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('createUpdate.selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return props.dataContactOption?.find(
                              (obj) => obj.id === value
                            )?.name
                          }}
                          onChange={(event: any) => {
                            console.log('contact_option', event.target.value)
                            setValue('contact_option', event.target.value)
                            trigger('contact_option')
                          }}
                        >
                          {props?.dataContactOption?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.name}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.contact_option}>
                          {errors.contact_option &&
                            `${errors.contact_option.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          )}
        </Grid>

        <Stack direction="row" justifyContent="start" spacing={2}>
          <Link
            href={
              platform() === 'SUPPLIER'
                ? '/supplier/crm/contact/list'
                : '/retailer/crm/contact/list'
            }
          >
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom type="submit" variant="contained" size="large">
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </>
  )
}
export default CreateUpdateComponent
