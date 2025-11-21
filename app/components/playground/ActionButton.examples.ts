/**
 * ActionButton Component - Usage Examples
 *
 * A versatile button component with multiple style variants for playground actions.
 *
 * Available Variants:
 * - solid (default): Blue background with shadow - primary actions
 * - outline: Transparent with blue border - secondary actions
 * - ghost: Transparent with hover effect - tertiary actions
 * - secondary: Neutral background - alternative actions
 *
 * Props:
 * - label: string (required) - Button text
 * - onClick: () => void (required) - Click handler
 * - icon?: Icon - Optional Phosphor icon component
 * - disabled?: boolean - Disable button
 * - id?: string - HTML id attribute
 * - className?: string - Additional CSS classes
 * - fullWidth?: boolean - Make button full width
 * - variant?: 'solid' | 'outline' | 'ghost' | 'secondary' - Button style variant
 *
 * Examples:
 *
 * // Solid variant (default) - Primary action
 * <ActionButton
 *   label="Extract Plain Text"
 *   onClick={handleExtract}
 *   icon={FileText}
 * />
 *
 * // Outline variant - Secondary action
 * <ActionButton
 *   label="Cancel"
 *   onClick={handleCancel}
 *   variant="outline"
 * />
 *
 * // Ghost variant - Tertiary action
 * <ActionButton
 *   label="Learn More"
 *   onClick={handleLearnMore}
 *   variant="ghost"
 *   icon={Info}
 * />
 *
 * // Secondary variant - Alternative action
 * <ActionButton
 *   label="Re-run Document"
 *   onClick={handleRetry}
 *   variant="secondary"
 *   icon={ArrowCounterClockwise}
 * />
 *
 * // Full width button
 * <ActionButton
 *   label="Extract Key-Value"
 *   onClick={handleExtract}
 *   fullWidth
 * />
 *
 * // Disabled state
 * <ActionButton
 *   label="Processing..."
 *   onClick={handleProcess}
 *   disabled={isLoading}
 * />
 */

export {};
