import React from 'react';
import { Controller } from 'react-hook-form';
import { Input, Textarea, RadioGroup, Radio, Checkbox } from '@heroui/react';

const InputFactory = ({ config, control, errors }) => {
    const commonProps = {
        id: config.name,
        variant: 'bordered',
        className: 'w-full',
        errorMessage: errors[config.name]?.message,
        isInvalid: !!errors[config.name],
    };

    switch (config.type) {
        case 'select':
            // return (
            //     <Controller
            //         name={config.name}
            //         control={control}
            //         render={({ field: { onChange, value } }) => (
            //             <Select
            //                 {...commonProps}
            //                 value={value}
            //                 onChange={onChange}
            //                 placeholder={`Select ${config.label.toLowerCase()}`}
            //             >
            //                 {config.options?.map((option) => (
            //                     <SelectItem key={option.value} value={option.value}>
            //                         {option.label}
            //                     </SelectItem>
            //                 ))}
            //             </Select>
            //         )}
            //     />
            // );

            return (
                <Controller
                  name={config.name}
                  control={control}
                  render={({ field }) => (
                    <div className="h-full"> {/* Parent container with full height */}
                      <select
                        {...field}
                        className="p-2 block w-full h-[56%] rounded-xl border border-[#E0E0E0] bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {/* Show empty option if no value is selected */}
                        {!field.value && <option value="">Select an option</option>}
                        {config.options.map((option) => (
                          <option 
                            key={option.value} 
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                />
              );

        case 'textarea':
            return (
                <Controller
                    name={config.name}
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            {...commonProps}
                            {...field}
                            rows={4}
                            placeholder={`Enter ${config.label.toLowerCase()}`}
                        />
                    )}
                />
            );

        case 'radio':
            return (
                <Controller
                    name={config.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <RadioGroup
                            {...commonProps}
                            value={value}
                            onChange={onChange}
                            orientation="horizontal"
                            className="flex flex-wrap gap-4"
                        >
                            {config.options?.map((option) => (
                                <Radio key={option.value} value={option.value}>
                                    {option.label}
                                </Radio>
                            ))}
                        </RadioGroup>
                    )}
                />
            );

        case 'checkbox':
            return (
                <Controller
                    name={config.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Checkbox
                            isSelected={value}
                            onChange={(e) => onChange(e.target.checked)}
                        >
                            {config.label}
                        </Checkbox>
                    )}
                />
            );

        default:
            return (
                <Controller
                    name={config.name}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...commonProps}
                            {...field}
                            type={config.type}
                            placeholder={`Enter ${config.label.toLowerCase()}`}
                        />
                    )}
                />
            );
    }
};

export default InputFactory;