import { OptimizerConfig, ImageInputDescriptor, ContainerDescriptor } from '../model/descriptors';
import { TransformPlan } from '../interfaces';
export declare function createTransformPlan(input: ImageInputDescriptor, config?: OptimizerConfig, container?: ContainerDescriptor): TransformPlan;
