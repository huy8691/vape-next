import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'

import dynamic from 'next/dynamic'
// import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#fff' : theme.palette.action.disabled,
  height: '100%',
}))

// const CardSection = styled(Card)(({ theme }) => ({
//   backgroundColor:
//     theme.palette.mode === 'light' ? '#F1F3F9' : theme.palette.action.hover,
//   // boxShadow: 'none',
// }))

const chart1 = {
  options: {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    },
  },
  series: [
    {
      name: 'series-1',
      data: [30, 40, 45, 50, 49, 60, 70],
    },
    {
      name: 'series-1',
      data: [31, 10, 5, 80, 45, 60, 100],
    },
  ],
}

const chart2 = {
  series: [
    {
      name: 'Net Profit',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: 'Revenue',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: 'Free Cash Flow',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ],
  options: {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
      ],
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return '$ ' + val + ' thousands'
        },
      },
    },
  },
}

const chart3 = {
  series: [44, 55, 13, 43, 22],
  options: {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  },
}

const chart4 = {
  series: [
    {
      name: 'Males',
      data: [
        0.4, 0.65, 0.76, 0.88, 1.5, 2.1, 2.9, 3.8, 3.9, 4.2, 4, 4.3, 4.1, 4.2,
        4.5, 3.9, 3.5, 3,
      ],
    },
    {
      name: 'Females',
      data: [
        -0.8, -1.05, -1.06, -1.18, -1.4, -2.2, -2.85, -3.7, -3.96, -4.22, -4.3,
        -4.4, -4.1, -4, -4.1, -3.4, -3.1, -2.8,
      ],
    },
  ],
  options: {
    chart: {
      type: 'bar',
      height: 440,
      stacked: true,
    },
    colors: ['#008FFB', '#FF4560'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },

    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      min: -5,
      max: 5,
      title: {
        // text: 'Age',
      },
    },
    tooltip: {
      shared: false,
      x: {
        formatter: function (val: any) {
          return val
        },
      },
      y: {
        formatter: function (val: any) {
          return Math.abs(val) + '%'
        },
      },
    },
    title: {
      text: "Buyer's age",
    },
    xaxis: {
      categories: [
        '85+',
        '80-84',
        '75-79',
        '70-74',
        '65-69',
        '60-64',
        '55-59',
        '50-54',
        '45-49',
        '40-44',
        '35-39',
        '30-34',
        '25-29',
        '20-24',
        '15-19',
        '10-14',
        '5-9',
        '0-4',
      ],
      title: {
        text: 'Percent',
      },
      labels: {
        formatter: function (val: any) {
          return Math.abs(Math.round(val)) + '%'
        },
      },
    },
  },
}

const SectionChart = () => {
  // fix error when use next theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  // fix error when use next theme
  return (
    <Grid container spacing={3} mb={2}>
      <Grid item xs={3}>
        <CardCustom variant="outlined">
          <CardContent>
            <Chart
              options={chart1.options}
              series={chart1.series}
              type="line"
            />
          </CardContent>
        </CardCustom>
      </Grid>
      <Grid item xs={3}>
        <CardCustom variant="outlined">
          <CardContent>
            <Chart options={chart2.options} series={chart2.series} type="bar" />
          </CardContent>
        </CardCustom>
      </Grid>
      <Grid item xs={3}>
        <CardCustom variant="outlined">
          <CardContent>
            <Chart options={chart3.options} series={chart3.series} type="pie" />
          </CardContent>
        </CardCustom>
      </Grid>
      <Grid item xs={3}>
        <CardCustom variant="outlined">
          <CardContent>
            <Chart
              options={chart4.options}
              series={chart4.series}
              type="bar"
              height={350}
            />
          </CardContent>
        </CardCustom>
      </Grid>
    </Grid>
  )
}

export default SectionChart
