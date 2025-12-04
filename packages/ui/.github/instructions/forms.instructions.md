# Forms Module Instructions

> Guidelines for using and creating form components in `@repo/ui/forms`

---

## 📦 Import

```typescript
import {
  FormField,
  SelectField,
  DateField,
  CheckboxField,
  SwitchField,
  RadioGroupField,
  AreaField,
  FormSection,
  PasswordInput,
} from '@repo/ui/forms';
```

---

## 🧩 Available Components

### Core Form Fields

| Component     | Description                | Use Case                |
| ------------- | -------------------------- | ----------------------- |
| `FormField`   | Text/number/email input    | Basic text entry        |
| `AreaField`   | Multi-line textarea        | Long text, descriptions |
| `FormSection` | Group of fields with title | Organize form sections  |

### Selection Fields

| Component         | Description        | Use Case                  |
| ----------------- | ------------------ | ------------------------- |
| `SelectField`     | Dropdown selection | Single choice from list   |
| `RadioGroupField` | Radio button group | Visible options selection |
| `SelectDropdown`  | Enhanced dropdown  | Complex selection needs   |

### Toggle Fields

| Component       | Description         | Use Case                 |
| --------------- | ------------------- | ------------------------ |
| `CheckboxField` | Checkbox with label | Boolean with description |
| `SwitchField`   | Toggle switch       | On/off settings          |

### Date & Time Fields

| Component   | Description | Use Case       |
| ----------- | ----------- | -------------- |
| `DateField` | Date picker | Date selection |

### Input Variants

| Component       | Description                     | Use Case           |
| --------------- | ------------------------------- | ------------------ |
| `PasswordInput` | Password with visibility toggle | Login/signup forms |

---

## 📝 Usage Examples

### FormField - Basic Text Input

```typescript
import { FormField } from '@repo/ui/forms';

<FormField
  id="name"
  label="Category Name"
  value={name}
  onChange={setName}
  placeholder="Enter category name"
  required
  error={errors.name}
  description="This name will be displayed in reports"
/>

// With number type
<FormField
  id="amount"
  label="Budget Amount"
  type="number"
  value={amount}
  onChange={setAmount}
  min={0}
  step={0.01}
  required
/>
```

### SelectField - Dropdown Selection

```typescript
import { SelectField } from '@repo/ui/forms';

<SelectField
  id="category"
  label="Category"
  value={category}
  onChange={setCategory}
  placeholder="Select a category"
  options={categories.map(c => ({
    value: c.id,
    label: c.name,
  }))}
  required
/>
```

### DateField - Date Picker

```typescript
import { DateField } from '@repo/ui/forms';

<DateField
  id="dueDate"
  label="Due Date"
  value={dueDate}
  onChange={(date) => date && setDueDate(date)}
  required
  captionLayout="dropdown" // 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'
/>
```

### CheckboxField - Boolean with Description

```typescript
import { CheckboxField } from '@repo/ui/forms';

<CheckboxField
  id="terms"
  label="I agree to the terms and conditions"
  checked={acceptTerms}
  onChange={setAcceptTerms}
  description="You must accept to continue"
  required
/>
```

### SwitchField - Toggle Switch

```typescript
import { SwitchField } from '@repo/ui/forms';

<SwitchField
  id="isRecurring"
  label="Recurring"
  checked={isRecurring}
  onChange={setIsRecurring}
  description="Repeat this reminder automatically"
/>
```

### RadioGroupField - Radio Button Group

```typescript
import { RadioGroupField } from '@repo/ui/forms';

<RadioGroupField
  id="period"
  label="Budget Period"
  value={period}
  onChange={setPeriod}
  options={[
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ]}
  required
/>
```

### AreaField - Multi-line Text

```typescript
import { AreaField } from '@repo/ui/forms';

<AreaField
  id="description"
  label="Description"
  value={description}
  onChange={setDescription}
  placeholder="Enter a detailed description..."
  rows={4}
  maxLength={500}
/>
```

### FormSection - Grouped Fields

```typescript
import { FormSection } from '@repo/ui/forms';

<FormSection
  title="Personal Information"
  description="Enter your basic details"
  collapsible
  defaultOpen
>
  <FormField id="firstName" label="First Name" value={firstName} onChange={setFirstName} />
  <FormField id="lastName" label="Last Name" value={lastName} onChange={setLastName} />
  <FormField id="email" label="Email" type="email" value={email} onChange={setEmail} />
</FormSection>
```

### PasswordInput - Secure Password Entry

```typescript
import { PasswordInput } from '@repo/ui/forms';

<PasswordInput
  id="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
/>
```

---

## 🎨 Props Reference

### FormFieldProps

```typescript
interface FormFieldProps {
  id: string; // Unique identifier
  label: ReactNode; // Field label
  value: string | number | Date; // Current value
  onChange: (value: string) => void; // Change handler

  // Optional
  placeholder?: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'time';
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  error?: string;
  description?: string;
  className?: string;
  children?: ReactNode; // Custom input override
  labelAddon?: ReactNode; // Extra content next to label
}
```

### DateFieldProps

```typescript
interface DateFieldProps {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;

  // Optional
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  className?: string;
  captionLayout?: 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years';
}
```

### SwitchFieldProps

```typescript
interface SwitchFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;

  // Optional
  required?: boolean;
  disabled?: boolean;
  description?: string;
  error?: string;
  className?: string;
}
```

---

## ✅ Best Practices

### 1. Always Provide IDs

```typescript
// ✅ Good - unique, descriptive ID
<FormField id="budgetAmount" ... />

// ❌ Bad - missing or generic ID
<FormField id="input1" ... />
```

### 2. Use Proper Input Types

```typescript
// ✅ Good - semantic type
<FormField type="email" ... />
<FormField type="number" min={0} step={0.01} ... />

// ❌ Bad - always text
<FormField type="text" ... /> // for email
```

### 3. Show Validation Errors

```typescript
// ✅ Good - display error messages
<FormField
  error={touched.name && errors.name}
  ...
/>
```

### 4. Group Related Fields

```typescript
// ✅ Good - use FormSection for groups
<FormSection title="Contact Information">
  <FormField id="email" ... />
  <FormField id="phone" ... />
</FormSection>
```

### 5. Provide Helpful Descriptions

```typescript
// ✅ Good - guide users
<FormField
  description="This will be displayed on your profile"
  ...
/>
```

---

## 🔧 Creating New Form Fields

When creating a new form field component:

```typescript
import { Label } from '#/components/ui/label';
import { cn } from '#/lib/utils';

export interface NewFieldProps {
  id: string;
  label: string;
  value: ValueType;
  onChange: (value: ValueType) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  className?: string;
}

export function NewField({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  description,
  className,
}: NewFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={id}
        className={cn(error && 'text-destructive')}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Your custom input here */}

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
```

---

## 📚 Related

- [Dialogs Instructions](./dialogs.instructions.md) - For form dialogs
- [Components Instructions](./components.instructions.md) - Base UI components
