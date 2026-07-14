import requestCheck from 'npm:request-check'
import npmTthrowlhos, { IThrowlhos } from 'npm:throwlhos'
import is from '@zarco/isness'
const throwlhos = npmTthrowlhos.default

export type Validator = (...args: ICheckObj[]) => void

export interface ICheckObj {
  // deno-lint-ignore no-explicit-any
  [key: string]: any
  isRequiredField?: boolean
}

export interface IInvalidField {
  // deno-lint-ignore no-explicit-any
  value: any
  // deno-lint-ignore no-explicit-any
  field: any
  message: string
}

export class BaseRules {
  protected rc

  constructor() {
    this.rc = requestCheck.default()
    this.rc.setRequiredMessage('Campo é obrigatório', { key: 'commons.required.field' })

    this.rc.addRule('pagination', {
      validator: (value: any) => typeof value === 'object' && is.number(value.page) && is.number(value.limit),
      message: 'Valor para paginação inválido! Deve ser um objeto com as propriedades "page" e "limit".',
      i18n: {
        key: 'rules.baseRules.invalidPagination',
      },
    })
  }

  validate = (...args: ICheckObj[]): void => {
    try {
      const arrayOfInvalid = this.rc.check(...args)
      if (arrayOfInvalid?.length) {
        const joinedFieldNames = arrayOfInvalid.map((e: IInvalidField) => e.field).join(', ')
        throw throwlhos.err_badRequest(
          `Campos ${joinedFieldNames} inválidos (${arrayOfInvalid.length})`,
          arrayOfInvalid,
          {
            key: 'rules.baseRules.invalidFields',
            options: {
              joinedFieldNames,
              length: arrayOfInvalid.length,
            },
          },
        )
      }
    } catch (err: any) {
      console.warn(err)
      throw {
        code: 422,
        message: err.message ?? err,
        status: err.status,
        errors: err.errors,
        i18n: err.i18n,
      } as IThrowlhos
    }
  }
}