"use client"
import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react'
import { Combobox, Group, CheckIcon, useCombobox, Button } from "@mantine/core";

const data = [
  'VN',
  'EN'
];
export default function LanguagePicker() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }
    },
  });
  const [value, setValue] = useState(data.at(0));

  const options = data.map((item) => (
    <Combobox.Option value={item} key={item} active={item === value}>
      <Group gap="xs">
        {item === value && <CheckIcon size={12} />}
        <span>{item}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.updateSelectedOptionIndex('active');
      }}
    >
      <Combobox.Target targetType="button">
        <Button
          w='5rem'
          bg='none'
          c='gray.6'
          rightSection={<IconChevronDown size='1rem' />}
          onClick={() => combobox.toggleDropdown()}
        >
          {value}
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
