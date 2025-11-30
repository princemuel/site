// SPDX-License-Identifier: Apache-2.0
#![deny(clippy::all)]

// use napi::bindgen_prelude::*;
use napi_derive::napi;

#[napi]
pub fn sum(a: u32, b: u32) -> u32 {
    a + b
}
