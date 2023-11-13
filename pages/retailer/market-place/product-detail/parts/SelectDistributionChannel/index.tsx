import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, MenuItem } from '@mui/material'
import { SelectCustom } from 'src/components'
import { DistributionOfProductType } from './modelSelectDC'
import { objToStringParam } from 'src/utils/global.utils'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

interface Props {
  listDistribution: DistributionOfProductType[]
}
const SelectDistributionChannelComponent = (props: Props) => {
  const router = useRouter()
  const { t } = useTranslation('productDetail')

  const handleOnChangeSelectDC = (variant_id: number) => {
    router.replace(
      {
        search: `${objToStringParam({
          id: router.query.id,
          dc_id: variant_id,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }
  return (
    <Box>
      <SelectCustom
        defaultValue={props.listDistribution[0].id}
        sx={{ minWidth: '250px' }}
        placeholder={t('selectDistributionChannel')}
        IconComponent={() => (
          <KeyboardArrowDownIcon
            sx={{
              color: 'transparent',
            }}
          />
        )}
        onChange={(event) => handleOnChangeSelectDC(Number(event.target.value))}
      >
        {props.listDistribution.map((obj, index) => {
          return (
            <MenuItem key={index} value={obj.id}>
              {obj.name}
            </MenuItem>
          )
        })}
      </SelectCustom>
    </Box>
  )
}

export default SelectDistributionChannelComponent
