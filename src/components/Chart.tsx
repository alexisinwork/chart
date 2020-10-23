import React, { useEffect } from 'react'
import { ParsedCsv } from '../utils/fetchCsv'
import { LineChart, XAxis, YAxis , Tooltip, CartesianGrid, Line } from 'recharts'

type ChartProps = {
  data: Array<ParsedCsv>,
  selectedCampaign: string,
}

const Chart = ({ data, selectedCampaign }: ChartProps) =>
  <LineChart
    width={500}
    height={400}
    data={data}
    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
  >
    <XAxis dataKey="Date" />
    <YAxis dataKey="Impressions" />
    <Tooltip />
    <CartesianGrid stroke="#f5f5f5" />
    <Line type="monotone" dataKey="Clicks" stroke="#ff7300" />
    <Line type="monotone" dataKey="Impressions" stroke="#387908" />
  </LineChart>

export default Chart
