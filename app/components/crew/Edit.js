import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import ImageDropzone from '../ImageDropzone';
import About from '../about/About';
import Languages from '../language/Languages';

import Place from '../place/PlaceContainer';

import OrgContact from './OrgContact';
import OrgActivity from './OrgActivity';

import LinksWebEdit from '../link/LinksWebEdit';
import LinksSocialEdit from '../link/LinksSocialEdit';
import LinksSkypeEdit from '../link/LinksSkypeEdit';
import LinksMobileEdit from '../link/LinksMobileEdit';
import LinksPhoneEdit from '../link/LinksPhoneEdit';

import {
  editCrew,
  suggestCrewMember,
  addCrewMember,
  addCrewImage,
  addCrewTeaserImage,
  aboutCrewMakePrimary,
  removeCrewMember
} from '../../reducers/actions';

const Member = injectIntl(({ member, me, onDelete, intl }) => {
  const meLabel = intl.formatMessage({
    id: 'Me',
    defaultMessage: 'Me'
  });
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {`${member.stagename}`}
        {(member._id === me) ?
          <i className="badge badge-default badge-pill">{meLabel}</i>
          : null
        }
      </span>
      {member.deletionInProgress ?
        <button
          type="button"
          className="btn btn-danger disabled"
        >
          <i className="fa fa-fw fa-spinner fa-pulse"></i>
        </button>
        :
        <button
          type="button"
          className="btn btn-danger"
          onClick={onDelete}
        >
          <i className="fa fa-trash"></i>
        </button>
      }
    </li>
  );
});

let CrewForm = props => {
  const { handleSubmit, dispatch, crew, user } = props;
  const memberSuggestions = props.user._memberSuggestions || [];
  const findMember = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestCrewMember(crew._id, e.target.value));
    } // FIXME: handle reset
  };
  const addMember = (crewId) => (member) => (e) => {
    e.preventDefault();
    return dispatch(addCrewMember(crewId, member));
  };

  const removeMember = (crewId) => (member) => (e) => {
    e.preventDefault();
    return dispatch(removeCrewMember(crewId, member));
  };

  const onImageDrop = (crewId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addCrewImage(crewId, file));
  };

  const onTeaserImageDrop = (crewId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addCrewTeaserImage(crewId, file));
  };
  const onCrewAboutMakePrimary = (crewId) => (about) => (e) => {
    about.is_primary = true;
    return dispatch(aboutCrewMakePrimary(crewId, about._id));
  };
  
  if (!props.org) props.org = {};
  
  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <Field
          name="_id"
          component="input"
          type="hidden"
        />

        <div className="form-group">
          <label htmlFor="name">
            <FormattedMessage
              id="name"
              defaultMessage="Name"
            />
          </label>
          &nbsp;
          <span class="badge badge-success">
            <FormattedMessage
              id="public"
              defaultMessage='Public'
            />
          </span>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="teaserImage">
            <FormattedMessage
              id="teaserImage"
              defaultMessage="TeaserImage"
            />
          </label>
          &nbsp;
          <span class="badge badge-success">
            <FormattedMessage
              id="public"
              defaultMessage='Public'
            />
          </span>
          {crew && crew.teaserImage ?
            <img
              className="img-thumbnail mb-3"
              src={crew.teaserImage.publicUrl}
              alt={`teaser image of ${crew.name}`}
            /> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onTeaserImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">
            <FormattedMessage
              id="image"
              defaultMessage="Image"
            />
          </label>
          &nbsp;
          <span class="badge badge-success">
            <FormattedMessage
              id="public"
              defaultMessage='Public'
            />
          </span>
          {crew && crew.image && crew.image.publicUrl ?
            <div><img
              className="img-thumbnail mb-3"
              src={crew.image.publicUrl}
              alt={`image of ${crew.name}`}
            /></div> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="row">
          <div className="col-md-9 form-group">
            <label htmlFor="about">
              <FormattedMessage
                id="addabout"
                defaultMessage="About"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <div className="input-group">
              <Field
                className="form-control"
                name="about"
                component="textarea"
                rows="4"
                placeholder="About the crew"
                value={props.about}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <label htmlFor="aboutlanguage">
              <FormattedMessage
                id="language"
                defaultMessage="Language"
              />
            </label>
            {Languages ?
              <Field
                className="form-control custom-select"
                name="aboutlanguage"
                component="select"
                value={props.aboutlanguage}
              >
                <option value="en">
                  <FormattedMessage
                    id="language.en"
                    defaultMessage="English"
                  />
                </option>
                {Languages.map((c) => (
                  <option value={c.code}>{c.language}</option>
                ))
                }
                { /*  */}
              </Field> :
              <p>Loading languages…</p>
            }
          </div>
        </div>

        <label>
          <FormattedMessage
            id="manageabout"
            defaultMessage="Manage your About texts"
          />
        </label>
        <ul className="list-group mt-2">
          {
            crew && crew.abouts && crew.abouts.map((a) => (
              <About
                about={a}
                onMakePrimary={onCrewAboutMakePrimary(crew._id)(a)}
              />
            ))
          }
        </ul>

        <div className="form-group">
          <label htmlFor="members">
            <FormattedMessage
              id="members"
              defaultMessage='Members'
            />
          </label>
          &nbsp;
          <span class="badge badge-success">
            <FormattedMessage
              id="public"
              defaultMessage='Public'
            />
          </span>
          <ul className="list-group">
            {crew && crew.members && crew.members.map((m) => (
              <Member
                member={m}
                me={props.user._id}
                onDelete={removeMember(crew._id)(m)}
              />
            ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="member">
            <FormattedMessage
              id="inviteMembers"
              defaultMessage="Invite members"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'assignMembers',
              defaultMessage: 'Type to find users…'
            })}
            onKeyUp={findMember}
          />
          <div className="mt-1 list-group">
            {user && user._memberSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="suggestMembersLoading"
                  defaultMessage="Finding users…"
                />
              </div> :
              null
            }
            {memberSuggestions.map((m) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={addMember(props._id)(m)}
              >
                {m.stagename} ({m.name})
                </button>
            ))
            }
          </div>
        </div>

        <h3>
          <FormattedMessage
            id="org_extradata_title"
            defaultMessage="Organization Extra Data"
          />
        </h3>
        <div className="form-group">
          <label htmlFor="crew.org.name">
            <FormattedMessage
              id="crew.org.name"
              defaultMessage="Organisation legal name"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <Field
            className="form-control"
            name="crew.org.name"
            component="input"
            type="text"
            value={props.org.name}
          />
        </div>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.foundation_year">
              <FormattedMessage
                id="crew.org.foundation_year"
                defaultMessage="Organisation foundation year"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <Field
              className="form-control"
              name="crew.org.foundation_year"
              component="input"
              type="text"
              value={props.org.foundation_year}
            />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.type">
              <FormattedMessage
                id="crew.org.type"
                defaultMessage="Organisation type"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <Field
              className="form-control custom-select"
              name="crew.org.type"
              component="select"
            >
              <option value="">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.empty"
                  defaultMessage="Please select"
                />
              </option>
              <option value="art_gallery">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.art_gallery"
                  defaultMessage="Art gallery"
                />
              </option>
              <option value="centre_for_architecture">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.centre_for_architecture"
                  defaultMessage="Centre for Architecture"
                />
              </option>
              <option value="choir">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.choir"
                  defaultMessage="Choir"
                />
              </option>
              <option value="concert_hall">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.concert_hall"
                  defaultMessage="Concert hall"
                />
              </option>
              <option value="dance_company">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.dance_company"
                  defaultMessage="Dance Company"
                />
              </option>
              <option value="design-art_centre">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.design-art_centre"
                  defaultMessage="Design/Art centre"
                />
              </option>
              <option value="festival">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.festival"
                  defaultMessage="Festival (non Audiovisual)"
                />
              </option>
              <option value="group_of_young_people_active_in_youth_work">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.group_of_young_people_active_in_youth_work"
                  defaultMessage="Group of young people active in youth work"
                />
              </option>
              <option value="higher_education_institution">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.higher_education_institution"
                  defaultMessage="Higher education institution (tertiary level)"
                />
              </option>
              <option value="library">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.library"
                  defaultMessage="Library"
                />
              </option>
              <option value="literature_foundation">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.literature_foundation"
                  defaultMessage="Literature Foundation"
                />
              </option>
              <option value="local_public_body">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.local_public_body"
                  defaultMessage="Local Public body"
                />
              </option>
              <option value="multimedia_association">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.multimedia_association"
                  defaultMessage="Multimedia association"
                />
              </option>
              <option value="museum">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.museum"
                  defaultMessage="Museum"
                />
              </option>
              <option value="music_centre">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.music_centre"
                  defaultMessage="Music Centre"
                />
              </option>
              <option value="national_public_body">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.national_public_body"
                  defaultMessage="National Public body"
                />
              </option>
              <option value="non-governmental_organisation-association-social_enterprise">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.non-governmental_organisation-association-social_enterprise"
                  defaultMessage="Non-governmental organisation/association/social enterprise"
                />
              </option>
              <option value="opera">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.opera"
                  defaultMessage="Opera"
                />
              </option>
              <option value="orchestra">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.orchestra"
                  defaultMessage="Orchestra"
                />
              </option>
              <option value="regional_public_body">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.regional_public_body"
                  defaultMessage="Regional Public body"
                />
              </option>
              <option value="research_institute-centre">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.research_institute-centre"
                  defaultMessage="Research Institute/Centre"
                />
              </option>
              <option value="school-institute-educational_centre-general_education">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.school-institute-educational_centre-general_education"
                  defaultMessage="School/Institute/Educational centre – General education (secondary level)"
                />
              </option>
              <option value="street_art_association">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.street_art_association"
                  defaultMessage="Street art association"
                />
              </option>
              <option value="theatre">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.theatre"
                  defaultMessage="Theatre"
                />
              </option>
              <option value="other">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.type.other"
                  defaultMessage="Other"
                />
              </option>
            </Field>
          </div>
        </div>


        <div className="form-group">
          <label htmlFor="crew.org.logo">
            <FormattedMessage
              id="crew.org.logo"
              defaultMessage="Organisation logo (.svg only)"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          {crew && crew.org && crew.org.logo ?
            <div>
              <img
                className="img-thumbnail mb-3"
                src={crew.org.logo.publicUrl}
                alt={`Logo of ${props.org.name}`}
              />
            </div> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>


        <LinksWebEdit links={props.org.links} privacy="public" />
        <LinksSocialEdit links={props.org.links} privacy="public" />


        <div className="form-group">
          <label htmlFor="crew.org.public_email">
            <FormattedMessage
              id="crew.org.public_email"
              defaultMessage="Organisation public email"
            />
          </label>
          &nbsp;
          <span class="badge badge-success">
            <FormattedMessage
              id="public"
              defaultMessage='Public'
            />
          </span>
          <div className="input-group">
            <Field
              className="form-control"
              name="crew.org.public_email"
              component="input"
              type="text"
              value={props.org.public_email}
            />
            <div className="input-group-addon">
              <i className="fa fa-envelope"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-minus"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>
        </div>

        <LinksPhoneEdit links={props.org.links} privacy="public" />

        <div className="form-group">
          <label htmlFor="crew.org.aims_and_activities">
            <FormattedMessage
              id="crew.org.aims_and_activities"
              defaultMessage="Aims and activities of the organisation"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <Field
            className="form-control"
            name="crew.org.aims_and_activities"
            component="textarea"
            rows="4"
            placeholder={props.intl.formatMessage({
              id: 'about.placeholder',
              defaultMessage: 'Tell me something about aims and activities of the organisation.'
            })}
            value={props.org.aims_and_activities}
          />
        </div>

        <div className="form-group">
          <label htmlFor="crew.org.pic_code">
            <FormattedMessage
              id="crew.org.pic_code"
              defaultMessage="Organisation PIC Code"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <Field
            className="form-control"
            name="crew.org.pic_code"
            component="input"
            type="text"
            value={props.org.pic_code}
          />
        </div>

        <div className="form-group">
          <label htmlFor="crew.org.address">
            <FormattedMessage
              id="crew.org.address"
              defaultMessage="Organisation legal address (only one)"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <Place user={crew} />
          <ul className="list-group mt-2">
            {
              crew && crew.org && crew.org.address && crew.org.address.map((a) => (
                <Address address={a} />
              ))
            }
          </ul>
        </div>

        <div className="row">
          <div className="col-md-9 form-group">
            <label htmlFor="crew.org.vat_number">
              <FormattedMessage
                id="crew.org.vat_number"
                defaultMessage="Organisation vat number"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control"
              name="crew.org.able_to_recuperate_vat"
              component="input"
              type="text"
              value={props.org.vat_number}
            />
          </div>

          <div className="col-md-3 form-group">
            <label htmlFor="crew.org.able_to_recuperate_vat">
              <FormattedMessage
                id="crew.edit.form.label.crew.org.able_to_recuperate_vat"
                defaultMessage="Able to recuperate VAT?"
              />
            </label>
            <div>
              <input type="radio" value="1" name="crew.org.able_to_recuperate_vat" /> YES
              <input type="radio" value="0" name="crew.org.able_to_recuperate_vat" /> NO
            </div>

          </div>
        </div>

        <div className="form-group">
          <label htmlFor="crew.org.official_registration_number">
            <FormattedMessage
              id="crew.org.official_registration_number"
              defaultMessage="Organisation official registration number"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <Field
            className="form-control"
            name="crew.org.official_registration_number"
            component="input"
            type="text"
            value={props.org.official_registration_number}
          />
        </div>

        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.legal_representative_title">
              <FormattedMessage
                id="crew.org.legal_representative_title"
                defaultMessage="Organisation legal representative title"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control custom-select"
              name="crew.org.legal_representative_title"
              component="select"
            >
              <option value="">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.legal_representative_title.empty"
                  defaultMessage="Please select"
                />
              </option>
              <option value="en">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.legal_representative_title.mr"
                  defaultMessage="Mr."
                />
              </option>
              <option value="it">
                <FormattedMessage
                  id="crew.edit.form.label.crew.org.legal_representative_title.miss"
                  defaultMessage="Miss"
                />
              </option>
            </Field>

          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.legal_representative_role">
              <FormattedMessage
                id="crew.org.legal_representative_role"
                defaultMessage="Organisation legal representative role"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control"
              name="crew.org.legal_representative_role"
              component="input"
              type="text"
              value={props.org.legal_representative_role}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.legal_representative_name">
              <FormattedMessage
                id="crew.org.legal_representative_name"
                defaultMessage="Organisation legal representative name"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control"
              name="crew.org.legal_representative_name"
              component="input"
              type="text"
              value={props.org.legal_representative_name}
            />
          </div>

          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.legal_representative_surname">
              <FormattedMessage
                id="crew.org.legal_representative_surname"
                defaultMessage="Organisation legal representative surname"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control"
              name="crew.org.legal_representative_surname"
              component="input"
              type="text"
              value={props.org.legal_representative_surname}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="crew.org.legal_representative_email">
            <FormattedMessage
              id="crew.org.legal_representative_email"
              defaultMessage="Organisation legal representative email"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <div className="input-group">
            <Field
              className="form-control"
              name="crew.org.legal_representative_email"
              component="input"
              type="text"
              value={props.org.legal_representative_email}
            />
            <div className="input-group-addon">
              <i className="fa fa-envelope"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-minus"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>
        </div>

        <LinksMobileEdit links={props.org.legal_representative_links} privacy="private" />

        <LinksSkypeEdit links={props.org.legal_representative_links} privacy="private" />

        <LinksSocialEdit links={props.org.legal_representative_links} privacy="public" />

        <div className="form-group">
          <label htmlFor="crew.org.statute">
            <FormattedMessage
              id="crew.org.statute"
              defaultMessage="Organisation statute (pdf only)"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          {crew && crew.org && crew.org.statute ?
            <div>
              <img
                className="img-thumbnail mb-3"
                src={crew.org.statute.publicUrl}
                alt={`Organisation statute of ${props.org.name}`}
              />
            </div> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="crew.org.members_cv">
            <FormattedMessage
              id="crew.org.members_cv"
              defaultMessage="Organisation members cv (pdf only)"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          {crew && crew.org && crew.org.members_cv ?
            <div>
              <img
                className="img-thumbnail mb-3"
                src={crew.org.members_cv.publicUrl}
                alt={`Organisation members cv of ${props.org.name}`}
              />
            </div> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="crew.org.activity_report">
            <FormattedMessage
              id="crew.org.activity_report"
              defaultMessage="Organisation Activity Report (pdf only)"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          {crew && crew.org && crew.org.activity_report ?
            <div>
              <img
                className="img-thumbnail mb-3"
                src={crew.org.activity_report.publicUrl}
                alt={`Activity Report of ${props.org.name}`}
              />
            </div> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.permanent_employees">
              <FormattedMessage
                id="crew.org.permanent_employees"
                defaultMessage="Organisation permanent employees"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control"
              name="crew.org.permanent_employees"
              component="input"
              type="text"
              value={props.org.permanent_employees}
            />
          </div>

          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.permanent_employees_avnode">
              <FormattedMessage
                id="crew.org.permanent_employees_avnode"
                defaultMessage="Organisation permanent employees AVnode"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control"
              name="crew.org.permanent_employees_avnode"
              component="input"
              type="text"
              value={props.org.permanent_employees_avnode}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.temporary_employees">
              <FormattedMessage
                id="crew.org.temporary_employees"
                defaultMessage="Organisation temporary employees"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control"
              name="crew.org.temporary_employees"
              component="input"
              type="text"
              value={props.org.temporary_employees}
            />
          </div>

          <div className="col-md-6 form-group">
            <label htmlFor="crew.org.temporary_employees_avnode">
              <FormattedMessage
                id="crew.org.temporary_employees_avnode"
                defaultMessage="Organisation temporary employees AVnode"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control"
              name="crew.org.temporary_employees_avnode"
              component="input"
              type="text"
              value={props.org.temporary_employees_avnode}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="crew.org.relevance_in_the_project">
            <FormattedMessage
              id="crew.org.relevance_in_the_project"
              defaultMessage="Organisation relevance in the project"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <Field
            className="form-control"
            name="crew.org.relevance_in_the_project"
            component="textarea"
            rows="4"
            placeholder={props.intl.formatMessage({
              id: 'about.placeholder',
              defaultMessage: 'Tell me something about organisation relevance in the project.'
            })}
            value={props.org.relevance_in_the_project}
          />
        </div>

        <div className="form-group">
          <label htmlFor="crew.org.emerging_artists_definition">
            <FormattedMessage
              id="crew.org.emerging_artists_definition"
              defaultMessage="Organisation emerging artists definition"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <Field
            className="form-control"
            name="crew.org.emerging_artists_definition"
            component="textarea"
            rows="4"
            placeholder={props.intl.formatMessage({
              id: 'about.placeholder',
              defaultMessage: 'Tell me the organisation emerging artists definition.'
            })}
            value={props.org.emerging_artists_definition}
          />
        </div>

        <div className="form-group">
          <label htmlFor="crew.org.eu_grants_received_in_the_last_3_years">
            <FormattedMessage
              id="crew.org.eu_grants_received_in_the_last_3_years"
              defaultMessage="EU grants received in the last 3 years"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <Field
            className="form-control"
            name="crew.org.eu_grants_received_in_the_last_3_years"
            component="textarea"
            rows="4"
            placeholder={props.intl.formatMessage({
              id: 'about.placeholder',
              defaultMessage: 'EU grants received in the last 3 years.'
            })}
            value={props.org.eu_grants_received_in_the_last_3_years}
          />
        </div>

        <div className="form-group">
          <label htmlFor="crew.org.annual_turnover_in_euro">
            <FormattedMessage
              id="crew.org.annual_turnover_in_euro"
              defaultMessage="Organisation annual turnover in euro"
            />
          </label>
          &nbsp;
          <span class="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          <Field
            className="form-control"
            name="crew.org.annual_turnover_in_euro"
            component="input"
            type="text"
            value={props.org.annual_turnover_in_euro}
          />
        </div>

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="crew.edit.form.label.crew.org.contacts"
              defaultMessage="Organisation contacts (multiple)"
            />
          </legend>
          {
            crew && crew.contacts && crew.contacts.map((a) => (
                <OrgContact contact={a} />
            ))
          }
          <OrgContact contact={{}} />
        </fieldset>


          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="org_contact_title">
                <FormattedMessage
                  id="org_contact_title"
                  defaultMessage="Organisation contact title"
                />
              </label>
              &nbsp;
              <span class="badge badge-danger">
                <FormattedMessage
                  id="private"
                  defaultMessage='Private'
                />
              </span>
              <Field
                className="form-control custom-select"
                name="org_contact_title"
                component="select"
              >
                <option value="">
                  <FormattedMessage
                    id="crew.edit.form.label.org_contact_title.empty"
                    defaultMessage="Please select"
                  />
                </option>
                <option value="en">
                  <FormattedMessage
                    id="crew.edit.form.label.org_contact_title.mr"
                    defaultMessage="Mr."
                  />
                </option>
                <option value="it">
                  <FormattedMessage
                    id="crew.edit.form.label.org_contact_language.miss"
                    defaultMessage="Miss"
                  />
                </option>
              </Field>
            </div>
            <div className="col-md-6 form-group">
              <label htmlFor="org_contact_role">
                <FormattedMessage
                  id="org_contact_role"
                  defaultMessage="Organisation contact role"
                />
              </label>
              &nbsp;
              <span class="badge badge-danger">
                <FormattedMessage
                  id="private"
                  defaultMessage='Private'
                />
              </span>
              <Field
                className="form-control"
                name="org_contact_role"
                component="input"
                type="text"
                value={props.org_contact_role}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="org_contact_name">
                <FormattedMessage
                  id="org_contact_name"
                  defaultMessage="Organisation contact name"
                />
              </label>
              &nbsp;
              <span class="badge badge-danger">
                <FormattedMessage
                  id="private"
                  defaultMessage='Private'
                />
              </span>
              <Field
                className="form-control"
                name="org_contact_name"
                component="input"
                type="text"
                value={props.org_contact_name}
              />
            </div>

            <div className="col-md-6 form-group">
              <label htmlFor="org_contact_surname">
                <FormattedMessage
                  id="org_contact_surname"
                  defaultMessage="Organisation contact surname"
                />
              </label>
              &nbsp;
              <span class="badge badge-danger">
                <FormattedMessage
                  id="private"
                  defaultMessage='Private'
                />
              </span>
              <Field
                className="form-control"
                name="org_contact_surname"
                component="input"
                type="text"
                value={props.org_contact_surname}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="org_contact_email">
              <FormattedMessage
                id="org_contact_email"
                defaultMessage="Organisation contact email"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <div className="input-group">
              <Field
                className="form-control"
                name="org_contact_email"
                component="input"
                type="text"
                value={props.org_contact_email}
              />
              <div className="input-group-addon">
                <i className="fa fa-envelope"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="org_contact_language">
              <FormattedMessage
                id="org_contact_language"
                defaultMessage="Organisation contact language"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control custom-select"
              name="org_contact_language"
              component="select"
            >
              <option value="">
                <FormattedMessage
                  id="crew.edit.form.label.org_contact_language.empty"
                  defaultMessage="Please select"
                />
              </option>
              <option value="en">
                <FormattedMessage
                  id="crew.edit.form.label.org_contact_language.en"
                  defaultMessage="English"
                />
              </option>
              <option value="it">
                <FormattedMessage
                  id="crew.edit.form.label.org_contact_language.it"
                  defaultMessage="Italiano"
                />
              </option>
            </Field>

          </div>

          <div className="form-group">
            <label htmlFor="org_contact_mobile_phone">
              <FormattedMessage
                id="org_contact_mobile_phone"
                defaultMessage="Organisation contact mobile phone"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <div className="input-group">
              <Field
                className="form-control"
                name="org_contact_mobile_phone"
                component="input"
                type="text"
                value={props.org_contact_mobile_phone}
              />
              <div className="input-group-addon">
                <i className="fa fa-phone"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="org_contact_skype">
              <FormattedMessage
                id="org_contact_skype"
                defaultMessage="Organisation contact skype"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <div className="input-group">
              <Field
                className="form-control"
                name="org_contact_skype"
                component="input"
                type="text"
                value={props.org_contact_skype}
              />
              <div className="input-group-addon">
                <i className="fa fa-phone"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="org_contact_facebook">
              <FormattedMessage
                id="org_contact_facebook"
                defaultMessage="Organisation contact facebook"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <div className="input-group">
              <Field
                className="form-control"
                name="org_contact_facebook"
                component="input"
                type="text"
                value={props.org_contact_facebook}
              />
              <div className="input-group-addon">
                <i className="fa fa-link"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset className="form-group">
          <legend>Organisation activities (multiple)</legend>

          <div className="form-group">
            <label htmlFor="activity_name">
              <FormattedMessage
                id="activity_name"
                defaultMessage="Activity Name"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <Field
              className="form-control"
              name="activity_name"
              component="input"
              type="text"
              value={props.activity_name}
            />
          </div>

          <div className="form-group">
            <label htmlFor="activity_logo">
              <FormattedMessage
                id="activity_logo"
                defaultMessage="Activity logo (.svg only)"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            {crew && crew.activity_logo ?
              <div>
                <img
                  className="img-thumbnail mb-3"
                  src={crew.activity_logo.publicUrl}
                  alt={`Logo of ${props.org_name}`}
                />
              </div> :
              null
            }
            <ImageDropzone
              imageUploadInProgress={(crew && crew.imageUploadInProgress)}
              onDrop={onImageDrop(props._id)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="activity_start_date">
              <FormattedMessage
                id="activity_start_date"
                defaultMessage="Activity start date"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <div className="input-group">
              <div className="input-group-addon">
                <i className="fa fa-calendar"></i>
              </div>
              <Field
                className="form-control"
                name="activity_start_date"
                component="input"
                type="text"
                value={props.activity_start_date}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activity_is_running">
              <FormattedMessage
                id="activity_is_running"
                defaultMessage="Activity is running?"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <div>
              <input type="radio" value="1" name="activity_is_running" /> YES
              <input type="radio" value="0" name="activity_is_running" /> NO
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="activity_end_date">
              <FormattedMessage
                id="activity_end_date"
                defaultMessage="Activity end date (only if it is not running)"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <div className="input-group">
              <div className="input-group-addon">
                <i className="fa fa-calendar"></i>
              </div>
              <Field
                className="form-control"
                name="activity_end_date"
                component="input"
                type="text"
                value={props.activity_end_date}
              />
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="activity_month">
              <FormattedMessage
                id="activity_season"
                defaultMessage="Activity main season"
              />
            </label>
            &nbsp;
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
            <Field
              className="form-control custom-select"
              name="activity_season"
              component="select"
            >
              <option value="">
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.empty"
                  defaultMessage="Please select"
                />
              </option>
              <option value='fullyear'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.fullyear"
                  defaultMessage="Full year"
                />
              </option>
              <option value='winter'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.winter"
                  defaultMessage="Winter"
                />
              </option>
              <option value='spring'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.spring"
                  defaultMessage="Spring"
                />
              </option>
              <option value='summer'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.summer"
                  defaultMessage="Summer"
                />
              </option>
              <option value='autumn'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.autumn"
                  defaultMessage="Autumn"
                />
              </option>
              <option value='01'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.january"
                  defaultMessage="January"
                />
              </option>
              <option value='02'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.february"
                  defaultMessage="February"
                />
              </option>
              <option value='03'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.march"
                  defaultMessage="March"
                />
              </option>
              <option value='04'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.april"
                  defaultMessage="April"
                />
              </option>
              <option value='05'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.may"
                  defaultMessage="May"
                />
              </option>
              <option value='06'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.june"
                  defaultMessage="June"
                />
              </option>
              <option value='07'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.july"
                  defaultMessage="July"
                />
              </option>
              <option value='08'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.august"
                  defaultMessage="August"
                />
              </option>
              <option value='09'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.september"
                  defaultMessage="September"
                />
              </option>
              <option value='10'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.october"
                  defaultMessage="October"
                />
              </option>
              <option value='11'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.november"
                  defaultMessage="November"
                />
              </option>
              <option value='12'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.december"
                  defaultMessage="December"
                />
              </option>
            </Field>
          </div>

          <div className="form-group">
            <label htmlFor="activity_city">
              <FormattedMessage
                id="activity_address"
                defaultMessage="Activity cities"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <div className="input-group">
              <Field
                className="form-control"
                name="activity_city"
                component="input"
                type="text"
                value={props.activity_end_date}
              />
              <Field
                className="form-control custom-select"
                name="activity_country"
                component="select"
              >
                <option value="">
                  <FormattedMessage
                    id="crew.edit.form.label.activity_country.empty"
                    defaultMessage="Please select a country"
                  />
                </option>
                <option value="en">
                  <FormattedMessage
                    id="crew.edit.form.label.activity_country.en"
                    defaultMessage="English"
                  />
                </option>
                <option value="it">
                  <FormattedMessage
                    id="crew.edit.form.label.activity_country.it"
                    defaultMessage="Italiano"
                  />
                </option>
              </Field>

              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activity_website">
              <FormattedMessage
                id="activity_website"
                defaultMessage="Activity Website"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <div className="input-group">
              <Field
                className="form-control"
                name="activity_website"
                component="input"
                type="text"
                value={props.activity_website}
              />
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activity_profiles">
              <FormattedMessage
                id="activity_web_social_channels"
                defaultMessage="Activity Web & Social Channels"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <div className="input-group">
              <Field
                className="form-control"
                name="activity_web_social_channels"
                component="input"
                type="text"
                value={props.activity_profiles}
              />
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activity_instagram">
              <FormattedMessage
                id="activity_public_email"
                defaultMessage="Activity Public Email"
              />
            </label>
            &nbsp;
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <div className="input-group">
              <Field
                className="form-control"
                name="activity_public_email"
                component="input"
                type="text"
                value={props.activity_public_email}
              />
              <div className="input-group-addon">
                <i className="fa fa-envelope"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>

        <fieldset className="form-group">
          <legend></legend>
          <legend>
            <FormattedMessage
                id="crew.edit.form.label.crew.org.activities"
                defaultMessage="Organisation activities (multiple)"
            />
          </legend>
          {
            crew && crew.activities && crew.activities.map((a) => (
                <OrgActivity contact={a} />
            ))
          }
          <OrgActivity contact={{}} />

        </fieldset>




        <div className="form-group">
          <button
            className="btn btn-primary"
            type="submit"
          >
            <FormattedMessage
              id="form.save"
              defaultMessage="Save"
            />
          </button>
        </div>
      </form>
    </Layout>
  );
};

CrewForm = injectIntl(reduxForm({ form: 'crew' })(CrewForm));

const EditCrew = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editCrew(props));
  };
  const onSubmitSuccess = () => {
    route('/account/crews');
  };
  return (
    <CrewForm
      initialValues={props.crew}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user,
  };
};

export default connect(mapStateToProps)(EditCrew);
