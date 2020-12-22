<template>
  <section>
    <div class="flight-departure">
      <h2>Departure Flight</h2>
      <div class="routes-filter-sort">
        <div class="routes">Cebu to Manila</div>
        <div class="sort">
          <div>Sort by:</div>
          <select class="custom-select">
            <option selected>Lowest to Highest Price</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
      </div>

      <div class="flight-list">
        <div class="flight-heading box-container box-shadow">
          <div>Flight Number</div>
          <div>Departure</div>
          <div>Arrival</div>
          <div>Duration</div>
          <div>Fare</div>
        </div>
        <div class="flight-box">
          <div>Flight Number</div>
          <div>Departure</div>
          <div>Arrival</div>
          <div>Duration</div>
          <div>Fare</div>
        </div>
      </div>
    </div>

    <div class="flight-return">
      <h2>Return Flight</h2>
      <div class="routes-filter-sort">
        <div class="routes">Cebu to Manila</div>
        <div class="sort">
          <div>Sort by:</div>
          <select class="custom-select">
            <option selected>Lowest to Highest Price</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
      </div>

      <div class="flight-list">
        <div class="flight-heading box-container box-shadow">
          <div>Flight Number</div>
          <div>Departure</div>
          <div>Arrival</div>
          <div>Duration</div>
          <div>Fare</div>
        </div>
        <div class="flight-box">
          <div>Flight Number</div>
          <div>Departure</div>
          <div>Arrival</div>
          <div>Duration</div>
          <div>Fare</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {}
</script>
<style lang="scss" scoped>
.flight-departure,
.flight-return {
  margin-top: 100px;

  h2 {
    font-family: $kautivaCyrillicBlackFont;
  }

  .flight-list {
    .flight-heading {
      display: flex;
      margin-bottom: 25px;
      padding: 12px;

      div {
        flex-basis: 100%;
        text-align: center;
        font-weight: 600;
      }
    }

    .flight-box {
      background: $primary-white;
      border-radius: 12px;
      //   border: 2px solid $primary-black;
      color: $primary-black;
      display: flex;
      padding: 15px;
      position: relative;
      text-align: center;
      text-transform: uppercase;
      width: 100%;

      &::before,
      &::after {
        background: $primary-yellow;
        // border: 2px solid $primary-black;
        content: '';
        height: 20px;
        position: absolute;
        width: 15px;
      }

      &::before {
        border-left-color: $primary-yellow;
        border-radius: 0 16px 16px 0;
        bottom: 0;
        left: -2px;
        margin-bottom: auto;
        margin-top: auto;
        top: 0;
      }

      &::after {
        border-radius: 16px 0 0 16px;
        border-right-color: $primary-yellow;
        bottom: 0;
        margin-bottom: auto;
        margin-top: auto;
        right: -2px;
        top: 0;
      }

      div {
        flex-basis: 100%;
        text-align: center;
        font-weight: 600;
      }
    }
  }
}

.flight-return {
  margin-top: 50px;
}
</style>
