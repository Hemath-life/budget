import { Plus, Trash2, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FormField } from '../form-field';
import { SelectField } from '../select-field';

export interface GuardianInfo {
  id: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianOccupation?: string;
}

export interface GuardiansListSectionProps {
  guardians: GuardianInfo[];
  onChange: (guardians: GuardianInfo[]) => void;
  className?: string;
  title?: string;
  showIcon?: boolean;
  relationOptions?: string[];
  minGuardians?: number;
  maxGuardians?: number;
}

export const GuardiansListSection = ({
  guardians,
  onChange,
  className = 'p-6 bg-card border rounded',
  title = 'Guardian Information',
  showIcon = true,
  relationOptions = ['Father', 'Mother', 'Guardian', 'Other'],
  minGuardians = 1,
  maxGuardians = 5,
}: GuardiansListSectionProps) => {
  const handleAddGuardian = () => {
    if (guardians.length < maxGuardians) {
      const newGuardian: GuardianInfo = {
        id: `guardian-${Date.now()}`,
        guardianName: '',
        guardianRelation: '',
        guardianPhone: '',
        guardianEmail: '',
        guardianOccupation: '',
      };
      onChange([...guardians, newGuardian]);
    }
  };

  const handleRemoveGuardian = (id: string) => {
    if (guardians.length > minGuardians) {
      onChange(guardians.filter((g) => g.id !== id));
    }
  };

  const handleFieldChange = (
    id: string,
    field: keyof GuardianInfo,
    value: string,
  ) => {
    onChange(
      guardians.map((guardian) =>
        guardian.id === id ? { ...guardian, [field]: value } : guardian,
      ),
    );
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            {showIcon && (
              <div className="text-primary flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {title}
            </h3>
          </div>
          {guardians.length < maxGuardians && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddGuardian}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Guardian
            </Button>
          )}
        </div>

        {guardians.map((guardian, index) => (
          <div key={guardian.id} className="space-y-4">
            {index > 0 && <div className="border-t my-6" />}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-muted-foreground">
                Guardian {index + 1}
              </span>
              {guardians.length > minGuardians && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveGuardian(guardian.id)}
                  className="gap-2 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                id={`guardianName-${guardian.id}`}
                label="Guardian Name"
                value={guardian.guardianName}
                onChange={(value: string) =>
                  handleFieldChange(guardian.id, 'guardianName', value)
                }
                placeholder="Enter guardian name"
                required
              />
              <SelectField
                id={`guardianRelation-${guardian.id}`}
                label="Relation"
                required
                value={guardian.guardianRelation}
                onChange={(value: string) =>
                  handleFieldChange(guardian.id, 'guardianRelation', value)
                }
                options={relationOptions}
                placeholder="Select relation"
              />
              <FormField
                id={`guardianPhone-${guardian.id}`}
                label="Guardian Phone"
                type="tel"
                value={guardian.guardianPhone}
                onChange={(value: string) =>
                  handleFieldChange(guardian.id, 'guardianPhone', value)
                }
                placeholder="+91 98765 43210"
                required
              />
              <FormField
                id={`guardianEmail-${guardian.id}`}
                label="Guardian Email"
                type="email"
                value={guardian.guardianEmail || ''}
                onChange={(value: string) =>
                  handleFieldChange(guardian.id, 'guardianEmail', value)
                }
                placeholder="guardian@example.com"
              />
              <FormField
                id={`guardianOccupation-${guardian.id}`}
                label="Guardian Occupation"
                value={guardian.guardianOccupation || ''}
                onChange={(value: string) =>
                  handleFieldChange(guardian.id, 'guardianOccupation', value)
                }
                placeholder="Enter occupation"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

GuardiansListSection.displayName = 'GuardiansListSection';
