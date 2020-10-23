import * as Papa from 'papaparse'

export type DataSource = 
  "Facebook Ads" |
  "Google Adwords" |
  "Google Analytics" |
  "Mailchimp"

export type ParsedCsv = {
  Campaign: string,
  Clicks: string,
  Datasource: DataSource,
  Date: string,
  Impressions: string,
}

type PromiseCsv = Promise<Array<ParsedCsv>>

export const fetchCsv = (url: string): PromiseCsv => {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      delimiter: ',',
      header: true,
      download: true,
      complete: (results) => {
        resolve(results.data as Array<ParsedCsv>)
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}