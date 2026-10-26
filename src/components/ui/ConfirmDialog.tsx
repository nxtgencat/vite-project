import { useId, useState } from 'react'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
  conflict,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onClose: () => void
  onConfirm: () => void
  conflict?: string | null
}) {
  const uid = useId()
  const [acknowledged, setAcknowledged] = useState(false)
  const needsAcknowledgement = Boolean(conflict)
  const confirm = () => {
    onConfirm()
    setAcknowledged(false)
  }
  const close = () => {
    setAcknowledged(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title={title}
      description={description}
      footer={
        <>
          <Button onClick={close}>Cancel</Button>
          <Button
            variant="danger"
            onClick={confirm}
            disabled={needsAcknowledgement && !acknowledged}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="pb-5">
        {conflict && (
          <div className="rounded-[6px] border border-warning/25 bg-warning-bg px-3 py-2 text-[13px] leading-5 text-warning-ink">
            <p className="font-medium">This cannot be undone.</p>
            <p>{conflict}</p>
            <label className="mt-2 flex items-start gap-2 text-[13px]">
              <input
                id={`${uid}-ack`}
                type="checkbox"
                className="checkbox mt-0.5"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
              />
              <span>I understand existing job posts keep the company name.</span>
            </label>
          </div>
        )}
      </div>
    </Dialog>
  )
}
