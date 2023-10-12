import React from 'react';
import FormRender, { formilyCore } from '../../../components/FormRender';
import AllTreeSelect from '../../../components/AllTreeSelect';
import schema from './data.json';

const components = {
  AllTreeSelect: (props: any) => (
    <AllTreeSelect 
      {...props}
      treeCheckable
    />
  )
}

const { onFieldChange, onFieldMount } = formilyCore;

export default () => {
  return (
    <FormRender 
      schema={schema}
      components={components}
      effects={() => {
        onFieldMount('treeSelect1', (field) => {
          field.setComponentProps({
            treeData: [
              {
                title: '选项1', value: 1
              }
            ]
          })
        })
        onFieldChange('treeSelect1', (field, form) => {
          // @ts-ignore
          if(field?.value?.includes(1)) {
            form.setFieldState('treeSelect2', state => {
              state.componentProps!.treeData = [
                {
                  title: '选项2', value: 2
                }
              ]
            })
          }
        })
      }}
    />
  )
}