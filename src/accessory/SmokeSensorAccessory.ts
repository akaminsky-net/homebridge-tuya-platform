import { PlatformAccessory } from 'homebridge';
import { TuyaPlatform } from '../platform';
import BaseAccessory from './BaseAccessory';

const SCHEMA_CODE = {
  SENSOR_STATUS: ['smoke_sensor_status', 'smoke_sensor_state'],
};

export default class SmokeSensor extends BaseAccessory {

  constructor(platform: TuyaPlatform, accessory: PlatformAccessory) {
    super(platform, accessory);

    this.configureSmokeDetected();
  }

  requiredSchema() {
    return [SCHEMA_CODE.SENSOR_STATUS];
  }

  configureSmokeDetected() {
    const schema = this.getSchema(...SCHEMA_CODE.SENSOR_STATUS);
    if (!schema) {
      return;
    }

    const { LEAK_NOT_DETECTED, LEAK_DETECTED } = this.Characteristic.LeakDetected;
    const service = this.accessory.getService(this.Service.SmokeSensor)
      || this.accessory.addService(this.Service.SmokeSensor);

    service.getCharacteristic(this.Characteristic.SmokeDetected)
      .onGet(() => {
        const status = this.getStatus(schema.code)!;
        if ((status.value === 'alarm' || status.value === '1')) {
          return LEAK_DETECTED;
        } else {
          return LEAK_NOT_DETECTED;
        }
      });
  }

}
