import { useState, useEffect } from 'react'
import { api } from './api'

type TProps = {
  getCashFlowList: () => void
}

export default function CashFlowForm({ getCashFlowList }: TProps) {
  const [formData, setFormData] = useState<TListItem>({
    id: 0,
    date: '',
    description: '',
    income: 0,
    outcome: 0,
  })

  const initFormData = (resetDate: boolean = false) => {
    const today = new Date()
    const initDateString = !resetDate && formData.date ? formData.date :
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      today.getDate().toString().padStart(2, '0')
    setFormData({
      id: 0,
      date: initDateString,
      description: '',
      income: 0,
      outcome: 0,
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const result = await api.post('/cashbook', {
      date: formData.date,
      description: formData.description,
      income: Number(formData.income),
      outcome: Number(formData.outcome),
    })

    if (result.status === 201 || result.status === 200) {
      initFormData()
      getCashFlowList()
    } else {
      // error handling
      console.log(result.status)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: value,
    }))
  }

  useEffect(() => {
    initFormData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div>
        <label className='block text-xs'>날짜</label>
        <input
          className='py-1 px-2'
          type='date'
          name='date'
          value={formData.date}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className='block text-xs'>내용</label>
        <input
          className='w-full py-2 px-4'
          type='text'
          name='description'
          placeholder='지출 항목이나 설명을 입력하세요'
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <div className='flex items-stretch justify-between gap-4'>
        <div className='flex items-baseline gap-4'>
          <div>
            <label className='block text-xs'>수입</label>
            <input
              className='py-1 px-2 text-right'
              type='number'
              name='income'
              placeholder='수입 금액을 입력하세요'
              value={formData.income}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='block text-xs'>지출</label>
            <input
              className='py-1 px-2 text-right'
              type='number'
              name='outcome'
              placeholder='지출 금액을 입력하세요'
              value={formData.outcome}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='flex items-end gap-4'>
          <button
            type='submit'
            className='py-2 px-4 hover:bg-gray-600 hover:text-white'
          >
            입력
          </button>
          <button
            type='reset'
            className='py-2 px-4 hover:bg-gray-600 hover:text-white'
            onClick={(e) => {
              e.preventDefault()
              initFormData(true)
            }}
          >
            리셋
          </button>
        </div>
      </div>
    </form>
  )
}
