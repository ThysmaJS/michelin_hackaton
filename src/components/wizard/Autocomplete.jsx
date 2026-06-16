import Hoverable from '../Hoverable.jsx';

/**
 * Text field with a floating suggestion menu. The caller supplies the rendered
 * suggestion rows as children and controls open/closed via `open`.
 */
export default function Autocomplete({ c, value, onChange, onFocus, placeholder, open, hint, children }) {
  return (
    <div style={{ position: 'relative', maxWidth: 480 }}>
      <Hoverable
        as="input"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        autoComplete="off"
        style={{ width: '100%', fontFamily: 'inherit', fontSize: 17, fontWeight: 600, color: c.ink, background: c.field, border: `1.5px solid ${c.fieldBorder}`, borderRadius: 14, padding: '17px 18px', outline: 'none', transition: 'border-color .2s' }}
        focusStyle={{ borderColor: '#27509b' }}
      />
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 20, background: c.menuBg, border: `1px solid ${c.borderStrong}`, borderRadius: 14, padding: 6, boxShadow: '0 18px 44px rgba(0,0,0,.28)', animation: 'fadeSlide .2s ease both', maxHeight: 280, overflow: 'auto' }}>
          {children}
        </div>
      )}
      <p style={{ margin: '14px 2px 0', fontSize: 12, color: c.inkFaint }}>{hint}</p>
    </div>
  );
}
