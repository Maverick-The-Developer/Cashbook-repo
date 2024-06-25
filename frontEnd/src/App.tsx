import { useState, useEffect } from 'react'

import './App.css'
import { api } from './api'
import CashFlowList from './CashFlowList'
import CashFlowForm from './CashFlowForm'

export default function App() {
  const [list, setList] = useState<TListItem[]>([])
  const [total, setTotal] = useState<{ income: number; outcome: number }>(
    {
      income: 0,
      outcome: 0,
    }
  )
  const [searchDates, setSearchDates] = useState<{
    from: string
    to: string
  }>({
    from: '',
    to: '',
  })

  const getCashFlowList = async (from: string = '', to: string = '') => {
    try {
      const today = new Date()
      const defaultFrom =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1).toString().padStart(2, '0') +
        '-01'
      // 2024-06-01
      const defaultTo = getStrDate(today)
      const paramFrom = from || searchDates.from || defaultFrom
      const paramTo = to || searchDates.to || defaultTo
      const result = await api.get('/cashbook', {
        params: {
          s: paramFrom,
          e: paramTo,
        },
      })

      const newList: TListItem[] = result.data?.cashFlows?.map(
        (item: TListItem) => ({
          date: item.date,
          description: item.description,
          income: item.income,
          outcome: item.outcome,
          id: item.id,
        })
      )

      const { income, outcome } = newList.reduce(
        (acc, cur) => ({
          income: acc.income + cur.income,
          outcome: acc.outcome + cur.outcome,
        }),
        { income: 0, outcome: 0 }
      )

      const subTotalItem = {
        id: -1,
        date: '',
        description: '소계',
        income,
        outcome,
      }

      newList.push(subTotalItem)
      setList(newList)

      setTotal({
        income: result?.data?.total?.income || 0,
        outcome: result?.data?.total?.outcome || 0,
      })

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  } // end of function getCashFlowList

  const deleteThis = async (id: number) => {
    const result = await api.delete(`/cashbook/${id}`)
    if (result.status === 200) {
      getCashFlowList()
    } else {
      // error handling
      console.log('line 89', result.status)
    }
  } // end of function deleteThis

  const initSearchDates = () => {
    const toDay = new Date()
    const fromDateString =
      toDay.getFullYear() +
      '-' +
      (toDay.getMonth() + 1).toString().padStart(2, '0') +
      '-01'
    const toDateString = getStrDate(toDay)

    setSearchDates({
      from: fromDateString,
      to: toDateString,
    })

    return { from: fromDateString, to: toDateString }
  } // end of function initSearchDates

  const getStrDate = (date: Date) => {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    )
  } // end of function getStrDate

  useEffect(() => {
    const { from, to } = initSearchDates()
    getCashFlowList(from, to)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className='w-full max-w-[1200px] mx-auto p-4'>
      <h1 className='text-3xl text-center'>금전출납부</h1>

      <CashFlowForm getCashFlowList={getCashFlowList} />

      <div className='list'>
        <div className='mb-4'>
          <label className='block text-xs'>검색기간</label>
          <div className='flex items-center gap-4'>
            <input
              type='date'
              name='from'
              value={searchDates.from}
              onChange={(e) =>
                setSearchDates((prev) => ({ ...prev, from: e.target.value }))
              }
            />
            ~
            <input
              type='date'
              name='to'
              value={searchDates.to}
              onChange={(e) =>
                setSearchDates((prev) => ({ ...prev, to: e.target.value }))
              }
            />
            <button
              className='py-1 px-4'
              type='button'
              onClick={() => {
                getCashFlowList()
              }}
            >
              검색
            </button>
          </div>
        </div>
        <CashFlowList list={list} total={total} deleteThis={deleteThis} />
      </div>
    </main>
  )
}
