import React, { forwardRef } from "react";
import { SketchPicker } from "react-color";
import { Control, Controller } from "react-hook-form";

const ColorPicker = forwardRef(
  (
    { controller }: { controller: Control<{ name: string; color: string }> },
    ref: React.Ref<SketchPicker>
  ) => {
    return (
      <Controller
        control={controller}
        name="color"
        render={({ field: { value, onChange } }) => (
          <SketchPicker color={value} onChange={(e) => onChange(e.hex)} ref={ref} />
        )}
      />
    );
  }
);

export default ColorPicker;
