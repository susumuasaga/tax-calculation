import * as React from 'react';
import { Container, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { LocationsCache } from '../State';
import { Location } from '../../server/models/Entity';

export type Props = {
  cache: LocationsCache;
  onClick(index: number): void;
};

/**
 * Locations component.
 * Input locations.
 * Output onClick(index).
 */
export function Locations({ cache, onClick }: Props) {
  return (
    <Container>
      <h2>
        Empresas({cache.locations!.length})
      </h2>
      <p>
        Clique sobre uma linha para abrir as transações da empresa desejada.
      </p>
      <ListGroup style={{ opacity: (cache.isFetching ? 0.5 : 1) }}>
        {
          cache.locations!.map((location, index) =>
            <ListGroupItem key={index}>
              <Row onClick={() => { onClick(index); }}>
                <Col md="3">{location.email}</Col>
                <Col md="3">{location.federalTaxId}</Col>
                <Col md="3">{cityState(location)}</Col>
                <Col md="3">{location.address.phone}</Col>
              </Row>
            </ListGroupItem>
          )
        }
      </ListGroup>
    </Container>
  );
}

function cityState(location: Location): string {
  const cityName = location.address.cityName;
  const state = location.address.state;
  if (cityName) {
    return `${cityName} - ${state}`;
  } else {
    return state;
  }
}
