import { mount } from '@vue/test-utils'
import PoiEdit from '@/components/poi_edit.vue'
import Vuetify from 'vuetify';
import Vue from 'vue';
Vue.use(Vuetify);

const vuetify = new Vuetify();

describe('PoiEdit', () => {
  test('Set the data', () => {
    const wrapper = mount(PoiEdit, {
      vuetify,
      propsData: {
        tags: {
          phone: 'test',
          brand: 'hello;world'
        }
      },
    });
    expect(wrapper.vm.name).toBe(null);
    expect(wrapper.vm.website).toBe(null);
    expect(wrapper.vm.brand).toEqual(['hello', 'world']);
    expect(wrapper.vm.phone).toEqual('test');
  });

  test('Set the data with undefined brand', () => {
    const wrapper = mount(PoiEdit, {
      vuetify,
      propsData: {
        tags: {
        }
      },
    });
    expect(wrapper.vm.brand).toEqual([]);
  });

  test('Set the data with contact: tags', () => {
    const wrapper = mount(PoiEdit, {
      vuetify,
      propsData: {
        tags: {
          'contact:phone': 'test',
          'contact:website': 'test'
        }
      },
    });
    expect(wrapper.vm.website).toBe('test');
    expect(wrapper.vm.phone).toEqual('test');
  });

  test('dataToSend()', () => {
    const wrapper = mount(PoiEdit, {
      vuetify,
      propsData: {
        tags: {
          'contact:phone': 'test2',
          'contact:website': 'test'
        }
      },
    });
    wrapper.vm.brand = ['test', 'test2']
    const data = wrapper.vm.dataToSend();
    expect(data['contact:website']).toEqual('test');
    expect(data['contact:phone']).toEqual('test2');
    expect(data['brand']).toEqual('test;test2');
    wrapper.setProps({
      tags: {
        website: 'test',
        phone: 'test'
      }
    });
    wrapper.vm.brand = [];
    const data2 = wrapper.vm.dataToSend();
    expect(data2.website).toEqual('test');
    expect(data2.phone).toEqual('test2');
    expect(data2.brand).toEqual(null);
  });
});
