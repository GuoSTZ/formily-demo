import React, { useEffect } from 'react';
import {
  ArrayCards,
  ArrayCollapse,
  ArrayItems,
  ArrayTable,
  ArrayTabs,
  Cascader,
  Checkbox,
  DatePicker,
  Editable,
  Form,
  FormButtonGroup,
  FormCollapse,
  FormGrid,
  FormItem,
  FormLayout,
  FormStep,
  FormTab,
  Input,
  NumberPicker,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  SelectTable,
  Space,
  Submit,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload
} from '@formily/antd'
import {
  createForm,
  registerValidateRules,
} from '@formily/core';
import { Form as IForm } from '@formily/core/esm/models/Form';
import { createSchemaField } from '@formily/react';
import { action } from '@formily/reactive';
/**
 * @deprecated 后续版本可能废弃，建议使用@meichuang/formily/dist/dependencies/formilyAntd来进行相关引用
 */
import * as formilyAntd from '@formily/antd';
/**
 * @deprecated 后续版本可能废弃，建议使用@meichuang/formily/dist/dependencies/formilyCore来进行相关引用
 */
import * as formilyCore from '@formily/core';
/**
 * @deprecated 后续版本可能废弃，建议使用@meichuang/formily/dist/dependencies/formilyReact来进行相关引用
 */
import * as formilyReact from '@formily/react';
/**
 * @deprecated 后续版本可能废弃，建议使用@meichuang/formily/dist/dependencies/formilyReactive来进行相关引用
 */
import * as formilyReactive from '@formily/reactive';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import * as onFormEffects from '@formily/core/esm/effects/onFormEffects';
import * as onFieldEffects from '@formily/core/esm/effects/onFieldEffects';
import {
  ArrayBaseAddition, 
  ArrayBaseRemove, 
  ArrayBaseMoveDown, 
  ArrayBaseMoveUp,
  ArrayBaseIndex
} from './components/CustomArrayBaseComponent';

const { onFormInit, onFormMount } = onFormEffects;

export interface FormRenderProps {
  /** Form 实例获取 */
  getForm?: (form: IForm<any>) => any;
  /** JSON 数据 */
  schema: any;
  /** 自定义组件 */
  components?: any
  /** 自定义表单组件，部分自定义组件props可能本就含有form属性，为了兼容之前对组件做的form注入处理，新增该属性来处理，重新注入formilyForm属性 */
  formComponents?: any;
  /** 自定义方法 */
  scope?: any;
  /** 自定义校验规则 */
  validator?: any
  /** 副作用方式添加入口 */
  effects?: (form: IForm<any>) => void;
}

// 同步设置输入控件的数据源
const useDataSource = (data: any, transform: Function) => (field: any) => {
  field.dataSource = transform ? transform(data) : data;
}

// 异步设置输入控件的数据源
const useAsyncDataSource = (service: Function, transform: Function) => (field: any) => {
  service(field).then(
    action?.bound?.((data: any) => {
      field.dataSource = transform ? transform(data) : data;
    })
  )
}

// FormCollapse 组件需要使用到的属性
const useFormCollapse = (activeKey: any) => FormCollapse?.createFormCollapse?.(activeKey);

const SchemaField = createSchemaField({
  components: {
    ArrayCards,
    ArrayCollapse,
    ArrayItems,
    ArrayTabs,
    ArrayTable,
    Cascader,
    Checkbox,
    ArrayBaseAddition,
    ArrayBaseIndex,
    ArrayBaseRemove,
    ArrayBaseMoveDown,
    ArrayBaseMoveUp,
    DatePicker,
    Editable,
    FormButtonGroup,
    FormCollapse,
    FormGrid,
    FormItem,
    FormLayout,
    FormStep,
    FormTab,
    Input,
    NumberPicker,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    SelectTable,
    Space,
    Submit,
    Switch,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload
  },
  scope: {
    useDataSource,
    useAsyncDataSource,
    useFormCollapse
  }
});

const FormRender = React.forwardRef((props: FormRenderProps, ref: any) => {
  const {
    getForm,
    schema = {},
    validator,
    components,
    formComponents,
    effects,
    ...otherProps
  } = props;

  useEffect(() => {
    return () => {
      baseform.removeEffects("customEffects");
    }
  }, [])

  const baseform: IForm<any> = React.useMemo(() =>
    createForm({
      validateFirst: true,
      effects: () => {
        onFormInit((form: IForm<any>) => {
          // 自定义校验规则注册
          registerValidateRules(validator);
        })
        onFormMount((form: IForm<any>) => {
          getForm && getForm(form);
        })
      },
    })
    , [])

  baseform.addEffects("customEffects", effects)

  React.useImperativeHandle(ref, () => {    
    return {
      form: baseform
    }
  })

  // 自定义组件传出form实例
  const handleCustomComp = () => {
    if (!components && !formComponents) return {};
    const customComp: any = {};
    const customExtraComp: any = {}
    for (let key in components) {
      const Comp = components[key];
      customComp[key] = (props: any) => <Comp {...props} form={baseform} />
    }
    for (let key in formComponents) {
      const Comp = formComponents[key];
      customExtraComp[key] = (props: any) => <Comp {...props} formilyForm={baseform} />
    }
    return {...customComp, ...customExtraComp};
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Form form={baseform} {...schema.form || {}}>
        <SchemaField {...otherProps} schema={schema.schema || {}} components={handleCustomComp()} />
      </Form>
    </ConfigProvider>
  )
})

export default FormRender;
export { onFieldEffects, onFormEffects };
export {
  formilyAntd,
  formilyCore,
  formilyReact,
  formilyReactive,
}
