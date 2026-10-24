import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

const EMPTY_FILTERS = { text: '', tipo: 'TODOS', estado: 'TODOS' };


const ControlledSearchBar = ({ onChange: externalOnChange, onClear: externalOnClear, ...rest }) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const handleChange = (next) => {
    setFilters(next);
    externalOnChange?.(next);
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    externalOnClear?.();
  };

  return (
    <SearchBar
      {...rest}
      filters={filters}
      onChange={handleChange}
      onClear={handleClear}
    />
  );
};

const renderBar = (props = {}) => render(<ControlledSearchBar {...props} />);

describe('SearchBar', () => {
  it('emite onChange con el texto actualizado al escribir', async () => {
    const user = userEvent.setup();
    const onChange = jasmine.createSpy('onChange');
    renderBar({ onChange });

    const input = screen.getByLabelText(/buscar/i);
    await user.type(input, 'trap');

    expect(input.value).toBe('trap');

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.calls.mostRecent();
    expect(lastCall.args[0].text).toBe('trap');
    expect(lastCall.args[0].tipo).toBe('TODOS');
    expect(lastCall.args[0].estado).toBe('TODOS');
  });

  it('emite onChange con el tipo actualizado al cambiar el select', async () => {
    const user = userEvent.setup();
    const onChange = jasmine.createSpy('onChange');
    renderBar({ onChange });

    await user.selectOptions(screen.getByLabelText(/tipo/i), 'BEAT');

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.calls.mostRecent();
    expect(lastCall.args[0].tipo).toBe('BEAT');
  });
});