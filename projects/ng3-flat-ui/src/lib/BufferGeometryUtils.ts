import {
  BufferAttribute,
  BufferGeometry,
} from 'three';

//
// copied from https://github.com/mrdoob/three.js/blob/master/examples/jsm/utils/BufferGeometryUtils.js v144
//

export class BufferGeometryUtils {

  /**
   * @param  {Array<BufferGeometry>} geometries
   * @param  {Boolean} useGroups
   * @return {BufferGeometry}
   */
  static mergeBufferGeometries(geometries: Array<BufferGeometry>, useGroups = false) {

    const isIndexed = geometries[0].index !== null;

    const attributesUsed = new Set(Object.keys(geometries[0].attributes));
    const morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));

    const attributes: any = {};
    const morphAttributes: any = {};

    const morphTargetsRelative = geometries[0].morphTargetsRelative;

    const mergedGeometry = new BufferGeometry();

    let offset = 0;

    for (let i = 0; i < geometries.length; ++i) {

      const geometry = geometries[i];
      let attributesCount = 0;

      // ensure that all geometries are indexed, or none

      if (isIndexed !== (geometry.index !== null)) {

        console.error('THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.');
        return null;

      }

      // gather attributes, exit early if they're different

      for (const name in geometry.attributes) {

        if (!attributesUsed.has(name)) {

          console.error('THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.');
          return null;

        }

        if (attributes[name] === undefined) attributes[name] = [];

        attributes[name].push(geometry.attributes[name]);

        attributesCount++;

      }

      // ensure geometries have the same number of attributes

      if (attributesCount !== attributesUsed.size) {

        console.error('THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. Make sure all geometries have the same number of attributes.');
        return null;

      }

      // gather morph attributes, exit early if they're different

      if (morphTargetsRelative !== geometry.morphTargetsRelative) {

        console.error('THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. .morphTargetsRelative must be consistent throughout all geometries.');
        return null;

      }

      for (const name in geometry.morphAttributes) {

        if (!morphAttributesUsed.has(name)) {

          console.error('THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '.  .morphAttributes must be consistent throughout all geometries.');
          return null;

        }

        if (morphAttributes[name] === undefined) morphAttributes[name] = [];

        morphAttributes[name].push(geometry.morphAttributes[name]);

      }

      // gather .userData

      mergedGeometry.userData['mergedUserData'] = mergedGeometry.userData['mergedUserData'] || [];
      mergedGeometry.userData['mergedUserData'].push(geometry.userData);

      if (useGroups) {

        let count = 0;

        if (isIndexed) {
          if (geometry.index)
            count = geometry.index.count;

        } else if (geometry.attributes['position'] !== undefined) {

          count = geometry.attributes['position'].count;

        } else {

          console.error('THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. The geometry must have either an index or a position attribute');
          return null;

        }

        mergedGeometry.addGroup(offset, count, i);

        offset += count;

      }

    }

    // merge indices

    if (isIndexed) {

      let indexOffset = 0;
      const mergedIndex = [];

      for (let i = 0; i < geometries.length; ++i) {

        const index = geometries[i].index;
        if (index) {

          for (let j = 0; j < index.count; ++j) {

            mergedIndex.push(index.getX(j) + indexOffset);

          }
        }

        indexOffset += geometries[i].attributes['position'].count;

      }

      mergedGeometry.setIndex(mergedIndex);

    }

    // merge attributes

    for (const name in attributes) {

      const mergedAttribute = BufferGeometryUtils.mergeBufferAttributes(attributes[name]);

      if (!mergedAttribute) {

        console.error('THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' attribute.');
        return null;

      }

      mergedGeometry.setAttribute(name, mergedAttribute);

    }

    // merge morph attributes

    for (const name in morphAttributes) {

      const numMorphTargets = morphAttributes[name][0].length;

      if (numMorphTargets === 0) break;

      mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
      mergedGeometry.morphAttributes[name] = [];

      for (let i = 0; i < numMorphTargets; ++i) {

        const morphAttributesToMerge = [];

        for (let j = 0; j < morphAttributes[name].length; ++j) {

          morphAttributesToMerge.push(morphAttributes[name][j][i]);

        }

        const mergedMorphAttribute = BufferGeometryUtils.mergeBufferAttributes(morphAttributesToMerge);

        if (!mergedMorphAttribute) {

          console.error('THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' morphAttribute.');
          return null;

        }

        mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);

      }

    }

    return mergedGeometry;

  }

  /**
   * @param {Array<BufferAttribute>} attributes
   * @return {BufferAttribute}
   */
  static mergeBufferAttributes(attributes: any) {

    let TypedArray;
    let itemSize;
    let normalized;
    let arrayLength = 0;

    for (let i = 0; i < attributes.length; ++i) {

      const attribute = attributes[i];

      if (attribute.isInterleavedBufferAttribute) {

        console.error('THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.');
        return null;

      }

      if (TypedArray === undefined) TypedArray = attribute.array.constructor;
      if (TypedArray !== attribute.array.constructor) {

        console.error('THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.');
        return null;

      }

      if (itemSize === undefined) itemSize = attribute.itemSize;
      if (itemSize !== attribute.itemSize) {

        console.error('THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.');
        return null;

      }

      if (normalized === undefined) normalized = attribute.normalized;
      if (normalized !== attribute.normalized) {

        console.error('THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.');
        return null;

      }

      arrayLength += attribute.array.length;

    }

    const array = new TypedArray(arrayLength);
    let offset = 0;

    for (let i = 0; i < attributes.length; ++i) {

      array.set(attributes[i].array, offset);

      offset += attributes[i].array.length;

    }

    return new BufferAttribute(array, itemSize, normalized);

  }

}
