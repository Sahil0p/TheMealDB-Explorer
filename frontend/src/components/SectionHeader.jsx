// frontend/src/components/SectionHeader.jsx
export default function SectionHeader({ title, subtitle }) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
          {subtitle ? <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
        </div>
        <div />
      </div>
    );
  }
  