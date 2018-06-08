import Helmet from 'react-helmet';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 * License
 *
 * @param {string} className - additional class
 *
 * @example <caption>Add license article</caption>
 * import License from 'Components/License';
 *
 * <License />
 *
 */
const License = ({
  className,
}) => (
  <article
    className={classNames(className)}
  >
    <Helmet>
      <title>License</title>
    </Helmet>

    <h1>License</h1>

    <p>THE WORK (AS DEFINED BELOW) IS PROVIDED UNDER THE TERMS OF THIS CREATIVE
    COMMONS PUBLIC LICENSE (CCPL OR LICENSE). THE WORK IS PROTECTED
    BY COPYRIGHT AND/OR OTHER APPLICABLE LAW. ANY USE OF THE WORK OTHER THAN
    AS AUTHORIZED UNDER THIS LICENSE OR COPYRIGHT LAW IS PROHIBITED.
    </p>

    <p>BY EXERCISING ANY RIGHTS TO THE WORK PROVIDED HERE, YOU ACCEPT AND AGREE TO BE BOUND BY
    THE TERMS OF THIS LICENSE. TO THE EXTENT THIS LICENSE MAY BE CONSIDERED TO BE A CONTRACT, THE
    LICENSOR GRANTS YOU THE RIGHTS CONTAINED HERE IN CONSIDERATION OF YOUR ACCEPTANCE OF SUCH TERMS
    AND CONDITIONS.
    </p>

    <h2>1. Definitions</h2>

    <p>Publicly Perform means to perform public recitations of the Work and to communicate
    to the public those public recitations, by any means or process, including by wire or wireless
    means or public digital performances; to make available to the public Works in such a way
    that members of the public may access these Works from a place and at a place individually
    chosen by them; to perform the Work to the public by any means or process and the communication
    to the public of the performances of the Work, including by public digital performance; to
    broadcast and rebroadcast the Work by any means including signs, sounds or images.
    </p>
    <p>Reproduce means to make copies of the Work by any means including without limitation
    by sound or visual recordings and the right of fixation and reproducing fixations of the Work,
    including storage of a protected performance or phonogram in digital form or other
    electronic medium.
    </p>
  </article>
);

License.propTypes = {
  className: PropTypes.string,
};

License.defaultProps = {
  className: '',
};

export default License;
