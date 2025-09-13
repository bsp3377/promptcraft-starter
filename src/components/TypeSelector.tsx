type Props = {
  value: string
  onChange: (v: string) => void
}

const types = ['Image','Text','Video','App/Code','Other']

export default function TypeSelector({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl border overflow-hidden">
      {types.map(t => {
        const active = value === t
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={[
              'px-3 py-1.5 text-sm',
              active ? 'bg-gray-900 text-white' : 'bg-white hover:bg-gray-50'
            ].join(' ')}
          >
            {t}
          </button>
        )
      })}
    </div>
  )
}
