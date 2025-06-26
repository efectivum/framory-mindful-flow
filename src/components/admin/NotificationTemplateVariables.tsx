
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface NotificationTemplateVariablesProps {
  variables: string[];
  onChange: (variables: string[]) => void;
}

export const NotificationTemplateVariables: React.FC<NotificationTemplateVariablesProps> = ({
  variables,
  onChange
}) => {
  const [newVariable, setNewVariable] = useState('');

  const addVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      onChange([...variables, newVariable]);
      setNewVariable('');
    }
  };

  const removeVariable = (variable: string) => {
    onChange(variables.filter(v => v !== variable));
  };

  return (
    <div>
      <Label>Template Variables</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={newVariable}
          onChange={(e) => setNewVariable(e.target.value)}
          placeholder="Add variable name"
          onKeyPress={(e) => e.key === 'Enter' && addVariable()}
        />
        <Button type="button" onClick={addVariable} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <Badge key={variable} variant="secondary" className="flex items-center gap-1">
            {variable}
            <X
              className="w-3 h-3 cursor-pointer"
              onClick={() => removeVariable(variable)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
