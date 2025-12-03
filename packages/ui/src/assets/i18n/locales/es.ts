import type { LocaleMessages } from '../types';

export const esMessages = {
  common: {
    ok: 'Aceptar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    continue: 'Continuar',
    loading: 'Cargando…',
    retry: 'Intentar de nuevo',
    searchPlaceholder: 'Buscar…',
    yes: 'Sí',
    no: 'No',
    close: 'Cerrar',
  },
  navigation: {
    home: 'Inicio',
    dashboard: 'Panel',
    billing: 'Facturación',
    analytics: 'Analítica',
    settings: 'Configuración',
    support: 'Soporte',
  },
  status: {
    success: 'Éxito',
    pending: 'Pendiente',
    warning: 'Advertencia',
    error: 'Algo salió mal',
    empty: 'Nada que mostrar todavía',
  },
  table: {
    empty: 'No se encontraron registros',
    loading: 'Cargando filas…',
    totalLabel: '{{count}} en total',
    selectedLabel: '{{count}} seleccionados',
  },
  form: {
    required: 'Este campo es obligatorio',
    invalidEmail: 'Ingresa un correo válido',
    minLength: 'Debe tener al menos {{count}} caracteres',
    maxLength: 'Debe tener {{count}} caracteres o menos',
    patternMismatch: 'El valor no coincide con el formato esperado',
  },
  actions: {
    create: 'Crear',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    submit: 'Enviar',
    reset: 'Restablecer',
  },
} as const satisfies LocaleMessages;
