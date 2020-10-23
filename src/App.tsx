import React, { useEffect, useState } from 'react'
import { isEmpty, map } from 'lodash/fp'
import Select from 'react-select'
import { format } from 'date-fns'

import { fetchCsv, ParsedCsv, DataSource } from './utils/fetchCsv'
import Chart from './components/Chart'

export type SourceType = { value: DataSource, label: DataSource}
export type CampaignType ={ value: string, label: string}

const App = () => {
  const csvUrl: string = 'http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv'
  const [data, setData] = useState<Array<ParsedCsv>>([])
  const [filteredData, setFilteredData] = useState<Array<ParsedCsv>>([])

  const [sources, setSources] = useState<Array<SourceType>>([])
  const [inputSources, setInputSources] = useState<Array<SourceType>>([])

  const [campaigns, setCampaigns] = useState<Array<CampaignType>>([])
  const [inputCampaigns, setInputCampaigns] = useState<Array<CampaignType>>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>('')
  // First data load: Triggered once
  useEffect(() => {
    const sources: Array<SourceType> = []
    const campaigns: Array<CampaignType> = []

    async function getData() {
      const data = await fetchCsv(csvUrl)
      // Not functional, but run through the data only once
      data.forEach((d: ParsedCsv) => {
        if (d.Date) {
          d.Date = format(new Date(d.Date.split('.').reverse().join('-')), 'dd. MMM.')
        }

        if (!isEmpty(d.Datasource) &&
        !sources.find(s => s.value === d.Datasource)) {
          sources.push({ value: d.Datasource, label: d.Datasource})
        }

        if (!campaigns.find(c => c.value === d.Campaign)) {
          campaigns.push({ value: d.Campaign, label: d.Campaign })
        }
      })

      setData(data)
      setSources(sources)
      setCampaigns(campaigns)
    }

    getData()
  }, [])
  // on source update by user
  useEffect(() => {
    if (!isEmpty(selectedCampaign) && !isEmpty(inputSources)) {
      const sourceValues = map((s: SourceType) => s.value)(inputSources)

      const filteredCampaigns = data.filter(d => 
        isEmpty(d.Datasource) || isEmpty(d.Campaign)
          ? false
          : sourceValues.includes(d.Datasource) &&
              selectedCampaign === d.Campaign
      )

      setFilteredData(filteredCampaigns)
    }
  }, [selectedCampaign, inputSources, campaigns, data])

  const handleInputSources = (val: any) => {
    setInputSources(val)
  }
  // if user type > 2 symbols - update inputCampaigns
  const handleInputChange = (input: string) => {
    const inputValue = input.replace(/\W/g, '')

    if (inputValue.length > 2) {
      const camps = campaigns.filter(campaign => campaign.value &&
        campaign.value.toLowerCase().includes(inputValue.toLowerCase()))

      setInputCampaigns(camps)
    }
  }

  const handleSelectChange = (val: any) => {
    const camp = val.value
    setSelectedCampaign(camp)
  }

  return (
    <div className="App">
      <p>Charts</p>

      <div className="home">
        <div className="filters">
          <Select
            options={sources}
            onChange={handleInputSources}
            isMulti
          />
          
          <Select
            options={inputCampaigns}
            onInputChange={handleInputChange}
            onChange={handleSelectChange}
            placeholder={'Type campaign to find...'}
          />
        </div>

        <Chart data={filteredData} selectedCampaign={selectedCampaign} />
      </div>
    </div>
  )
}

export default App
