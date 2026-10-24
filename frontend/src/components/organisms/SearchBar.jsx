import './SearchBar.css';

const TIPO_OPTIONS = ['TODOS', 'BEAT', 'EQUIPO'];
const ESTADO_OPTIONS = ['TODOS', 'DISPONIBLE', 'RETIRADO', 'AGOTADO'];

const SearchBar = ({ filters, onChange, onClear }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <form
      className="search-bar"
      onSubmit={(event) => event.preventDefault()}
      role="search"
    >
      <div className="search-bar__field search-bar__field--grow">
        <label className="search-bar__label" htmlFor="search-text">
          BUSCAR
        </label>
        <input
          id="search-text"
          className="search-bar__input"
          type="text"
          value={filters.text}
          onChange={(event) => handleChange('text', event.target.value)}
          placeholder="NOMBRE DEL PRODUCTO"
        />
      </div>

      <div className="search-bar__field">
        <label className="search-bar__label" htmlFor="search-tipo">
          TIPO
        </label>
        <select
          id="search-tipo"
          className="search-bar__input"
          value={filters.tipo}
          onChange={(event) => handleChange('tipo', event.target.value)}
        >
          {TIPO_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="search-bar__field">
        <label className="search-bar__label" htmlFor="search-estado">
          DISPONIBILIDAD
        </label>
        <select
          id="search-estado"
          className="search-bar__input"
          value={filters.estado}
          onChange={(event) => handleChange('estado', event.target.value)}
        >
          {ESTADO_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        className="search-bar__clear"
        type="button"
        onClick={onClear}
      >
        LIMPIAR
      </button>
    </form>
  );
};

export default SearchBar;