import type { ReactNode } from 'react';

/**
 * Shared building blocks for the Input family (single-line `Input`, multi-line
 * `Textarea`, and the extended `TimerInput`). The visual states from the design
 * system (default / focused / typing / filled / error) are driven by CSS
 * (`:focus-within`, `:placeholder-shown`, `data-error`) rather than a status
 * prop, so consumers only describe intent (label, helper, error, count).
 */
export type InputFieldOwnProps = {
  /**
   * Accessible, always-present field label. Rendered as a real `<label>` and
   * visually behaves as a floating label (resting over the field when empty,
   * shrinking to the top on focus or when filled).
   */
  label: string;
  /** Helper message shown under the field. Replaced by `errorText` when present. */
  helperText?: ReactNode;
  /** Error message. When set, the field enters its error state (red border, `aria-invalid`). */
  errorText?: ReactNode;
  /**
   * Enables the character counter (`현재/최대자`) and enforces the limit on the
   * field. The counter is hidden when `maxLength` is omitted.
   */
  maxLength?: number;
};
